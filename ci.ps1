#=================================================
#   Author: Sumi(po@ews.ink)
#   Version: 1.1.0
#   Updated: 2021-05-18
#   Description: Powershell 命令行执行工具
#=================================================

$Script:Version = "1.1.0"
$Script:Updated = "2021-05-18"
$Script:Workspace = Split-Path -Parent $MyInvocation.MyCommand.Definition
$Script:SaveCommand = "save"
$Script:DistCommand = "dist"
$Script:AutoDelete = "/public"  # 需要删除的文件夹写在这里即可 比如 /public/
$Script:MainBranch = "main"  # 老仓库是master 后来Github搞政治正确废除了"奴隶制" Code Lives Matter!!
$Script:EditBranch = "writing"

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

$curtime = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
if ([String]::IsNullOrEmpty($args[0])) {
  $commit_message = ""
  $Script:CommandBlock = "git status"
}
else {
  if ($args.Count -eq 1) {
    $commit_message = "Updated @$($curtime)"
  }
  else {
    $extraMsg = [String]$args[1]
    for ($i = 2; $i -lt $args.Count; $i++) {
      $extraMsg += " $($args[$i])"
    }
    $commit_message = "$($extraMsg.Trim())"
  }

  $Script:DoSave = @"
git switch $($Script:EditBranch)
git add .
git status
git commit -m `"$($commit_message)`"
git push -u origin $($Script:EditBranch)
git push gitee $($Script:EditBranch)
"@

  $Script:DoDist = @"
git switch $($Script:MainBranch)
git merge $($Script:EditBranch) -m "$($commit_message)"
git push -u origin $($Script:MainBranch)
git push gitee $($Script:MainBranch)
git switch $($Script:EditBranch)
"@

  if ($Script:SaveCommand.contains("$($args[0])")) {
    $Script:CommandBlock = $Script:DoSave
  }
  elseif ($Script:DistCommand.contains("$($args[0])")) {
    $Script:CommandBlock = $Script:DoDist
  }
  else {
    $Script:CommandBlock = "git status"
  }
}

# Trap {"Trap Error: $($_.Exception.Message)"; Continue}
Initialize-WorkingDirectory $Script:Workspace -DeletePath $Script:AutoDelete
Invoke-Command $Script:CommandBlock # -enableDebug
