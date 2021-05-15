#=================================================
#   Author: Sumi(po@ews.ink)
#   Version: 1.0.0
#   Updated: 2021-05-15
#   Description: Powershell 命令行执行工具
#=================================================

$Script:Version = "1.0.0"
$Script:Updated = "2021-05-15"


#=================================================
# @func Initialize-WorkingDirectory
# @desc 初始化工作 在执行 $commitWithMessage 前运行
#=================================================
function Initialize-WorkingDirectory {
  [CmdletBinding()] Param (
    [Parameter(Mandatory = $true, Position = 1)] [string]$Workspace,
    [Parameter(Mandatory = $true)] [string]$DeletePath
  )
  Set-Location $Workspace
  if (-not [String]::IsNullOrEmpty($DeletePath)) {
    $will_delete = $Workspace + "\" + $DeletePath.Trim("\/")  # 未处理 ./ 格式
    if ((Test-Path $will_delete) -and ($will_delete -ne $Workspace)) {
      Remove-Item $will_delete -Recurse
    }
  }
  Write-Host "当前脚本版本 v$($Version) 当前脚本工作路径为 $($Workspace)"
  Write-Host "最后更新时间 $($Updated)"
}

#=================================================
# @func Invoke-Command
# @desc 执行预设的指令
# @param {Boolean} $is_debug = $false 是否为调试模式
#=================================================
function Invoke-Command {
  [CmdletBinding()] Param (
    [Parameter(Mandatory = $true)] [string]$commandString,
    [switch]$enableDebug
  )
  if ($enableDebug) {
    $debugInfo = "[DEBUG] Try to exec this command:`n" + $commandString
    Write-Host $debugInfo
  }
  else {
    $command = [scriptblock]::Create($commandString)
    Trap { "Trap Error: $($_.Exception.Message)"; Continue }
    & $command
  }
}
