. ".\.github\utils\commander.ps1"

$Script:Workspace = Split-Path -Parent $MyInvocation.MyCommand.Definition
$Script:AutoDelete = "/public"  # 需要删除的文件夹写在这里即可 比如 /public/
$Script:editBranch = "writing"

$curtime = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
if ([String]::IsNullOrEmpty($args[0])) {
  $commit_message = "Updated @$($curtime)"
}
else {
  $extraMsg = [String]$args[0]
  for ($i = 1; $i -lt $args.Count; $i++) {
    $extraMsg += " $($args[$i])"
  }
  $commit_message = "$($extraMsg.Trim())"
}
$Script:CommandBlock = @"
git switch $($Script:editBranch)
git add .
git status
git commit -m `"$($commit_message)`"
git push -u origin $($Script:editBranch)
git push gitee $($Script:editBranch)
"@

# Trap {"Trap Error: $($_.Exception.Message)"; Continue}
Initialize-WorkingDirectory $Script:Workspace -DeletePath $Script:AutoDelete
Invoke-Command $Script:CommandBlock
