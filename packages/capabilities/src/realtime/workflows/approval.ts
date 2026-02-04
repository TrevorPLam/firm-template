// AI-META-BEGIN
// 
// AI-META: Shared package module
// OWNERSHIP: packages/capabilities
// ENTRYPOINTS: Imported by application modules
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test in package directory, pnpm type-check for types
// 
// AI-META-END

/**
 * Collaborative Content Creation and Approval Workflows
 * 
 * Manages multi-stage approval workflows for collaborative content
 */

import type {
  ApprovalRequest,
  ApprovalAction,
  ApprovalStatus,
  CollaborativeWorkflow,
  WorkflowStage,
  RealtimeErrorCode,
} from '../types';
import { RealtimeError } from '../types';

/**
 * Workflow event handler type
 */
type WorkflowEventHandler = (
  event: 'created' | 'updated' | 'approved' | 'rejected' | 'stage-changed',
  workflow: CollaborativeWorkflow
) => void;

/**
 * Collaborative workflow manager
 */
export class ApprovalWorkflow {
  private workflows: Map<string, CollaborativeWorkflow> = new Map();
  private requests: Map<string, ApprovalRequest> = new Map();
  private actions: Map<string, ApprovalAction[]> = new Map();
  private handlers: WorkflowEventHandler[] = [];

  /**
   * Create a new workflow
   */
  createWorkflow(
    name: string,
    documentId: string,
    stages: Omit<WorkflowStage, 'status'>[],
    createdBy: string
  ): CollaborativeWorkflow {
    const workflowId = this.generateId();

    const workflow: CollaborativeWorkflow = {
      id: workflowId,
      name,
      documentId,
      stages: stages.map(s => ({ ...s, status: 'draft' as ApprovalStatus })),
      currentStage: 0,
      status: 'draft',
      createdBy,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.workflows.set(workflowId, workflow);
    this.emitEvent('created', workflow);

    return workflow;
  }

  /**
   * Get a workflow by ID
   */
  getWorkflow(workflowId: string): CollaborativeWorkflow | undefined {
    return this.workflows.get(workflowId);
  }

  /**
   * Get workflows for a document
   */
  getWorkflowsByDocument(documentId: string): CollaborativeWorkflow[] {
    return Array.from(this.workflows.values())
      .filter(w => w.documentId === documentId);
  }

  /**
   * Create an approval request
   */
  createRequest(
    workflowId: string,
    requesterId: string,
    approvers: string[],
    message?: string,
    deadline?: number
  ): ApprovalRequest {
    const workflow = this.workflows.get(workflowId);

    if (!workflow) {
      throw new RealtimeError(
        RealtimeErrorCode.VALIDATION_ERROR,
        'Workflow not found'
      );
    }

    const requestId = this.generateId();

    const request: ApprovalRequest = {
      id: requestId,
      documentId: workflow.documentId,
      requesterId,
      approvers,
      status: 'pending',
      message,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      deadline,
    };

    this.requests.set(requestId, request);
    this.actions.set(requestId, []);

    // Update workflow status
    workflow.status = 'pending';
    workflow.updatedAt = Date.now();
    this.workflows.set(workflowId, workflow);

    this.emitEvent('updated', workflow);

    return request;
  }

  /**
   * Submit an approval action
   */
  submitAction(
    requestId: string,
    userId: string,
    action: 'approve' | 'reject' | 'request-revision',
    comment?: string
  ): ApprovalAction {
    const request = this.requests.get(requestId);

    if (!request) {
      throw new RealtimeError(
        RealtimeErrorCode.VALIDATION_ERROR,
        'Approval request not found'
      );
    }

    if (!request.approvers.includes(userId)) {
      throw new RealtimeError(
        RealtimeErrorCode.PERMISSION_ERROR,
        'User is not an approver for this request'
      );
    }

    if (request.status !== 'pending') {
      throw new RealtimeError(
        RealtimeErrorCode.VALIDATION_ERROR,
        'Request is not pending approval'
      );
    }

    const approvalAction: ApprovalAction = {
      requestId,
      userId,
      action,
      comment,
      timestamp: Date.now(),
    };

    const actions = this.actions.get(requestId) || [];
    actions.push(approvalAction);
    this.actions.set(requestId, actions);

    // Update request status based on action
    this.updateRequestStatus(request, actions);

    return approvalAction;
  }

  /**
   * Update request status based on actions
   */
  private updateRequestStatus(
    request: ApprovalRequest,
    actions: ApprovalAction[]
  ): void {
    const approvals = actions.filter(a => a.action === 'approve');
    const rejections = actions.filter(a => a.action === 'reject');
    const revisions = actions.filter(a => a.action === 'request-revision');

    // If any rejection, mark as rejected
    if (rejections.length > 0) {
      request.status = 'rejected';
      request.updatedAt = Date.now();
      this.requests.set(request.id, request);
      this.updateWorkflowFromRequest(request);
      return;
    }

    // If any revision request, mark as needing revision
    if (revisions.length > 0) {
      request.status = 'revision';
      request.updatedAt = Date.now();
      this.requests.set(request.id, request);
      this.updateWorkflowFromRequest(request);
      return;
    }

    // Check if all approvers have approved
    const uniqueApprovers = new Set(approvals.map(a => a.userId));

    if (uniqueApprovers.size === request.approvers.length) {
      request.status = 'approved';
      request.updatedAt = Date.now();
      this.requests.set(request.id, request);
      this.updateWorkflowFromRequest(request);
    }
  }

  /**
   * Update workflow based on request status
   */
  private updateWorkflowFromRequest(request: ApprovalRequest): void {
    const workflows = Array.from(this.workflows.values())
      .filter(w => w.documentId === request.documentId);

    for (const workflow of workflows) {
      const currentStage = workflow.stages[workflow.currentStage];

      if (request.status === 'approved') {
        currentStage.status = 'approved';

        // Move to next stage if available
        if (workflow.currentStage < workflow.stages.length - 1) {
          workflow.currentStage++;
          workflow.stages[workflow.currentStage].status = 'pending';
          this.emitEvent('stage-changed', workflow);
        } else {
          // All stages complete
          workflow.status = 'approved';
          this.emitEvent('approved', workflow);
        }
      } else if (request.status === 'rejected') {
        currentStage.status = 'rejected';
        workflow.status = 'rejected';
        this.emitEvent('rejected', workflow);
      } else if (request.status === 'revision') {
        currentStage.status = 'revision';
        workflow.status = 'revision';
        this.emitEvent('updated', workflow);
      }

      workflow.updatedAt = Date.now();
      this.workflows.set(workflow.id, workflow);
    }
  }

  /**
   * Get approval request
   */
  getRequest(requestId: string): ApprovalRequest | undefined {
    return this.requests.get(requestId);
  }

  /**
   * Get pending requests for a user
   */
  getPendingRequests(userId: string): ApprovalRequest[] {
    return Array.from(this.requests.values())
      .filter(r => 
        r.status === 'pending' && 
        r.approvers.includes(userId)
      );
  }

  /**
   * Get actions for a request
   */
  getActions(requestId: string): ApprovalAction[] {
    return this.actions.get(requestId) || [];
  }

  /**
   * Get overdue requests
   */
  getOverdueRequests(): ApprovalRequest[] {
    const now = Date.now();

    return Array.from(this.requests.values())
      .filter(r => 
        r.status === 'pending' && 
        r.deadline && 
        r.deadline < now
      );
  }

  /**
   * Cancel a request
   */
  cancelRequest(requestId: string, userId: string): void {
    const request = this.requests.get(requestId);

    if (!request) {
      throw new RealtimeError(
        RealtimeErrorCode.VALIDATION_ERROR,
        'Request not found'
      );
    }

    if (request.requesterId !== userId) {
      throw new RealtimeError(
        RealtimeErrorCode.PERMISSION_ERROR,
        'Only requester can cancel request'
      );
    }

    this.requests.delete(requestId);
    this.actions.delete(requestId);
  }

  /**
   * Archive a workflow
   */
  archiveWorkflow(workflowId: string): void {
    const workflow = this.workflows.get(workflowId);

    if (!workflow) {
      throw new RealtimeError(
        RealtimeErrorCode.VALIDATION_ERROR,
        'Workflow not found'
      );
    }

    this.workflows.delete(workflowId);

    // Clean up related requests
    const requests = Array.from(this.requests.entries())
      .filter(([_, r]) => r.documentId === workflow.documentId);

    for (const [id] of requests) {
      this.requests.delete(id);
      this.actions.delete(id);
    }
  }

  /**
   * Subscribe to workflow events
   */
  subscribe(handler: WorkflowEventHandler): () => void {
    this.handlers.push(handler);

    return () => {
      const index = this.handlers.indexOf(handler);
      if (index > -1) {
        this.handlers.splice(index, 1);
      }
    };
  }

  /**
   * Emit workflow event
   */
  private emitEvent(
    event: 'created' | 'updated' | 'approved' | 'rejected' | 'stage-changed',
    workflow: CollaborativeWorkflow
  ): void {
    for (const handler of this.handlers) {
      try {
        handler(event, workflow);
      } catch (error) {
        console.error('Error in workflow handler:', error);
      }
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get workflow statistics
   */
  getStats(): {
    totalWorkflows: number;
    activeWorkflows: number;
    pendingRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
  } {
    const workflows = Array.from(this.workflows.values());
    const requests = Array.from(this.requests.values());

    return {
      totalWorkflows: workflows.length,
      activeWorkflows: workflows.filter(w => 
        w.status === 'pending' || w.status === 'revision'
      ).length,
      pendingRequests: requests.filter(r => r.status === 'pending').length,
      approvedRequests: requests.filter(r => r.status === 'approved').length,
      rejectedRequests: requests.filter(r => r.status === 'rejected').length,
    };
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.workflows.clear();
    this.requests.clear();
    this.actions.clear();
  }
}

/**
 * Create a simple approval workflow
 */
export function createSimpleWorkflow(
  name: string,
  documentId: string,
  approvers: string[],
  createdBy: string
): {
  workflow: CollaborativeWorkflow;
  manager: ApprovalWorkflow;
} {
  const manager = new ApprovalWorkflow();

  const workflow = manager.createWorkflow(
    name,
    documentId,
    [
      {
        id: 'review',
        name: 'Review',
        order: 1,
        approvers,
        requiredApprovals: approvers.length,
      },
    ],
    createdBy
  );

  return { workflow, manager };
}

/**
 * Create a multi-stage workflow
 */
export function createMultiStageWorkflow(
  name: string,
  documentId: string,
  stages: Array<{
    name: string;
    approvers: string[];
    requiredApprovals: number;
  }>,
  createdBy: string
): {
  workflow: CollaborativeWorkflow;
  manager: ApprovalWorkflow;
} {
  const manager = new ApprovalWorkflow();

  const workflow = manager.createWorkflow(
    name,
    documentId,
    stages.map((stage, index) => ({
      id: `stage-${index}`,
      name: stage.name,
      order: index + 1,
      approvers: stage.approvers,
      requiredApprovals: stage.requiredApprovals,
    })),
    createdBy
  );

  return { workflow, manager };
}
