// 100% AI SLOP

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// === 配置区域 ===
const TARGET_DIR = './public/image-pro';      // 图片资源目录
const SOURCE_DIR = './src';         // 代码源码目录 (搜索这些文件里的引用)
const DELETE_ORIGINAL = true;      // 是否删除原图 (建议先设为 false，确认替换无误后再改为 true)
const ALLOWED_EXTS = ['.png', '.jpg', '.jpeg']; 
const TARGET_FILE_EXTS = ['.astro', '.md', '.mdx', '.ts', '.tsx', '.js', '.jsx', '.json', '.css'];
// =================

// 存储替换规则：{ oldStr: "/img/a.png", newStr: "/img/a.webp" }
const replacementRules = [];

async function main() {
  console.log('🚀 第一阶段: 扫描并转换图片...');
  await walkAndConvert(TARGET_DIR);

  console.log(`\n📋 收集到 ${replacementRules.length} 个替换规则，开始第二阶段...`);
  
  if (replacementRules.length > 0) {
    console.log('🚀 第二阶段: 扫描源码并替换引用...');
    await updateSourceCode(SOURCE_DIR);
  } else {
    console.log('😴 没有需要替换的引用。');
  }

  console.log('\n✨ 全部完成!');
}

async function walkAndConvert(dir) {
  const files = await fs.promises.readdir(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.promises.stat(filePath);
    
    if (stat.isDirectory()) {
      await walkAndConvert(filePath);
    } else {
      await processImage(filePath);
    }
  }
}

async function processImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  // 1. 检查是否是目标图片格式
  if (!ALLOWED_EXTS.includes(ext)) return;
  
  const newFilePath = filePath.replace(ext, '.webp');
  
  // 2. 生成 Web 路径 (用于源码替换)
  // 将系统路径 separator 统一转换为 web 的 /
  // 例如 public\img\demo.png -> /img/demo.png
  const relativePath = path.relative(TARGET_DIR, filePath).split(path.sep).join('/');
  const webPathOld = '/' + relativePath; // 原始引用路径
  const webPathNew = '/' + relativePath.replace(ext, '.webp'); // 新引用路径

  // 记录替换规则 (无论是否转换，我们都假设用户希望用 WebP)
  replacementRules.push({ oldStr: webPathOld, newStr: webPathNew });

  // 3. 执行转换 (如果 WebP 不存在)
  if (fs.existsSync(newFilePath)) {
    // console.log(`⏩ 跳过 (WebP已存在): ${path.basename(filePath)}`);
  } else {
    try {
      console.log(`🔄 转换中: ${path.basename(filePath)} -> .webp`);
      await sharp(filePath)
        .webp({ quality: 80 })
        .toFile(newFilePath);
    } catch (err) {
      console.error(`❌ 转换失败: ${filePath}`, err);
      return; // 失败的话就不删除原图了
    }
  }

  // 4. 删除原图
  if (DELETE_ORIGINAL) {
    try {
      fs.unlinkSync(filePath);
      console.log(`🗑️ 已删除原图: ${path.basename(filePath)}`);
    } catch (e) {
      console.error(`删除失败: ${filePath}`);
    }
  }
}

async function updateSourceCode(dir) {
  const files = await fs.promises.readdir(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.promises.stat(filePath);

    if (stat.isDirectory()) {
      await updateSourceCode(filePath);
    } else {
      const ext = path.extname(filePath).toLowerCase();
      // 只处理代码文件
      if (TARGET_FILE_EXTS.includes(ext)) {
        await replaceInFile(filePath);
      }
    }
  }
}

async function replaceInFile(filePath) {
  let content = await fs.promises.readFile(filePath, 'utf-8');
  let hasChanged = false;

  for (const rule of replacementRules) {
    if (content.includes(rule.oldStr)) {
      // 全局替换
      content = content.replaceAll(rule.oldStr, rule.newStr);
      hasChanged = true;
      console.log(`📝 更新引用 in [${path.basename(filePath)}]: ${rule.oldStr} -> .webp`);
    }
  }

  if (hasChanged) {
    await fs.promises.writeFile(filePath, content, 'utf-8');
  }
}

// 启动
main().catch(err => console.error(err));
