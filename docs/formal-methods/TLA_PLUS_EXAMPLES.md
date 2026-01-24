# TLA+ Formal Methods Examples

## What is TLA+?

TLA+ (Temporal Logic of Actions) is a formal specification language created by Leslie Lamport. It's used to mathematically prove that distributed systems are correct.

**Why Legendary Developers Use It:**
- Proves systems correct before building them
- Catches bugs that tests can't find
- Used by Amazon, Microsoft, and other top companies

## Example 1: Simple Counter

```tla
EXTENDS Naturals

VARIABLES counter

Init == counter = 0

Next == counter' = counter + 1

Spec == Init /\ [][Next]_counter
```

**What it proves:**
- Counter starts at 0
- Counter only increases
- Counter never decreases

## Example 2: Two-Phase Commit

```tla
EXTENDS Naturals

CONSTANTS Participants

VARIABLES 
    phase,      \* "prepare" or "commit" or "abort"
    votes,      \* Set of participants who voted
    decision    \* "commit" or "abort" or "none"

Init == 
    /\ phase = "prepare"
    /\ votes = {}
    /\ decision = "none"

Prepare == 
    /\ phase = "prepare"
    /\ phase' = "commit"
    /\ votes' = Participants
    /\ decision' = "commit"

Abort == 
    /\ phase = "prepare"
    /\ phase' = "abort"
    /\ decision' = "abort"
    /\ UNCHANGED votes

Next == Prepare \/ Abort

Spec == Init /\ [][Next]_<<phase, votes, decision>>
```

**What it proves:**
- All participants vote or none do
- Decision is consistent
- No partial commits

## Example 3: Distributed Lock

```tla
EXTENDS Naturals

CONSTANTS Nodes

VARIABLES 
    lock_holder,    \* Node holding the lock
    queue          \* Queue of nodes waiting

Init == 
    /\ lock_holder = NULL
    /\ queue = <<>>

AcquireLock(n) == 
    /\ lock_holder = NULL
    /\ queue = <<>>
    /\ lock_holder' = n
    /\ queue' = <<>>

ReleaseLock == 
    /\ lock_holder # NULL
    /\ IF queue = <<>> 
       THEN lock_holder' = NULL
       ELSE /\ lock_holder' = Head(queue)
            /\ queue' = Tail(queue)
    /\ UNCHANGED queue

RequestLock(n) == 
    /\ lock_holder # NULL \/ queue # <<>>
    /\ queue' = Append(queue, n)
    /\ UNCHANGED lock_holder

Next == 
    \E n \in Nodes: AcquireLock(n)
    \/ ReleaseLock
    \/ \E n \in Nodes: RequestLock(n)

Spec == Init /\ [][Next]_<<lock_holder, queue>>

MutualExclusion == 
    \A n1, n2 \in Nodes: 
        n1 # n2 => ~(lock_holder = n1 /\ lock_holder = n2)
```

**What it proves:**
- Only one node holds the lock at a time
- No deadlocks
- Fairness (all nodes eventually get the lock)

## How to Use TLA+

1. **Install TLA+ Toolbox**
   - Download from: https://lamport.azurewebsites.net/tla/toolbox.html
   - Or use VS Code extension: "TLA+"

2. **Write Specification**
   - Create a `.tla` file
   - Write your specification

3. **Model Check**
   - Use TLC model checker
   - It will find all possible states
   - Verify invariants

4. **Prove Correctness**
   - Use TLAPS (TLA+ Proof System)
   - Write mathematical proofs
   - Prove properties hold

## Resources

- **Learn TLA+**: https://learntla.com/
- **TLA+ Examples**: https://github.com/tlaplus/Examples
- **Amazon's Use**: https://www.youtube.com/watch?v=_9B__0GS5Bo
- **Leslie Lamport's Book**: "Specifying Systems"

## Why This Matters

**Legendary developers use TLA+ because:**
- Tests can't prove correctness
- Tests only check what you think of
- TLA+ checks all possible states
- Mathematical guarantees

**Example from Amazon:**
- They use TLA+ for all distributed algorithms
- Found bugs in DynamoDB before implementation
- Proved S3 consistency model correct

## Next Steps

1. Install TLA+ Toolbox
2. Work through "Learn TLA+" tutorial
3. Specify a simple distributed system
4. Model check it
5. Prove properties

This is what separates legendary developers from the rest.
