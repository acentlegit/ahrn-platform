# AHRN Monorepo Health Verification

Write-Host "--- AHRN Health Check ---" -ForegroundColor Cyan

$CriticalPaths = @(
    "backend/src/main.ts",
    "backend/src/app.module.ts",
    "frontend/src/App.tsx",
    "frontend/src/pages/homeowner/HomeownerDashboard.tsx",
    "frontend/src/pages/technician/TechnicianDashboard.tsx",
    "governance/risk/AI_Risk_Register.md",
    "docs/PRD.md"
)

$Passed = 0
$Failed = 0

foreach ($Path in $CriticalPaths) {
    if (Test-Path $Path) {
        Write-Host "[PASS] Found $Path" -ForegroundColor Green
        $Passed++
    } else {
        Write-Host "[FAIL] Missing $Path" -ForegroundColor Red
        $Failed++
    }
}

Write-Host "`nSummary: $Passed Passed, $Failed Failed" -ForegroundColor Cyan

if ($Failed -gt 0) {
    Write-Host "Repo health check FAILED. Please check missing artifacts." -ForegroundColor Red
    exit 1
} else {
    Write-Host "Repo health is NOMINAL. Ready for deployment." -ForegroundColor Green
    exit 0
}
