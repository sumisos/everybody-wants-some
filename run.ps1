. ".\.github\utils\commander.ps1"

$Script:Workspace = Split-Path -Parent $MyInvocation.MyCommand.Definition
$Script:AutoDelete = "/public"  # 需要删除的文件夹写在这里即可 比如 /public/
$Script:CommandBlock = @"
hugo server -D
"@

# Trap {"Trap Error: $($_.Exception.Message)"; Continue}
Initialize-WorkingDirectory $Script:Workspace -DeletePath $Script:AutoDelete
Invoke-Command $Script:CommandBlock
