// AI-META-BEGIN
// 
// AI-META: Application module
// OWNERSHIP: apps/your-dedicated-marketer
// ENTRYPOINTS: Imported by application modules
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test && pnpm type-check
// 
// AI-META-END

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {/* Spinner placeholder shown during Suspense boundaries */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="w-20 h-20 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Loading copy keeps layout stable while pages hydrate */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
        <p className="text-gray-600">Please wait while we prepare your content</p>
      </div>
    </div>
  )
}
