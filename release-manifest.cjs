'use strict';
// Explicit allowlists prevent private reference material from entering releases.
module.exports={
 app:['main.cjs','preload.cjs','index.html','style.css','app.js','settings.js','dialogs.js','interactions.js'],
 assets:['reference.svg','reference.ico'],
 notices:['LICENSE','NOTICE.md','THIRD_PARTY_NOTICES.md'],
 source:[
  'main.cjs','preload.cjs','index.html','style.css','app.js','settings.js','dialogs.js','interactions.js',
  'package.json','package-lock.json','build.cjs','tests.cjs','Launcher.cs',
  'README.md','LICENSE','NOTICE.md','THIRD_PARTY_NOTICES.md','PUBLISHING.md','CHANGELOG.md',
  '.gitignore','.gitattributes','.github/workflows/check.yml',
  'release-manifest.cjs','audit-release.cjs','pack-source.cjs',
  'assets/reference.svg','assets/reference.ico','docs/preview.png'
 ]
};
