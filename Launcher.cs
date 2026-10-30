using System;
using System.IO;
using System.Diagnostics;
using System.Windows.Forms;
using System.Reflection;
[assembly: AssemblyTitle("界面对照")]
[assembly: AssemblyDescription("独立离线界面对照工具 · 非官方")]
[assembly: AssemblyProduct("界面对照 · 非官方 Claude 学习参考")]
[assembly: AssemblyVersion("1.1.0.0")]
internal static class Launcher {
  [STAThread]
  private static void Main() {
    string root=AppDomain.CurrentDomain.BaseDirectory;
    string exe=Path.Combine(root,"runtime","ClaudeReference.exe");
    if(!File.Exists(exe)) {
      MessageBox.Show("未找到运行文件。请完整解压整个文件夹，再打开本程序。\n不要单独移动这个启动文件。","界面对照 · 非官方",MessageBoxButtons.OK,MessageBoxIcon.Information);
      return;
    }
    try {
      var start=new ProcessStartInfo(exe);
      start.WorkingDirectory=Path.GetDirectoryName(exe);
      start.UseShellExecute=false;
      start.CreateNoWindow=true;
      start.EnvironmentVariables.Remove("ELECTRON_RUN_AS_NODE");
      Process.Start(start);
    } catch(Exception ex) {
      MessageBox.Show("无法打开对照工具：\n"+ex.Message,"界面对照 · 非官方",MessageBoxButtons.OK,MessageBoxIcon.Error);
    }
  }
}
