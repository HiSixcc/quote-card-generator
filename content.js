/**
 * @fileoverview 内容脚本，负责处理网页交互和显示卡片生成界面
 */

// 全局变量
let selectedText = "";
let selectionIcon = null;
let lastSelectedRange = null;
let lastSelectedText = "";

// 创建选择文本后显示的图标
function createSelectionIcon() {
  const icon = document.createElement("div");
  icon.className = "quote-card-selection-icon";
  
  // 更现代的卡片图标
  icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" stroke-width="2"/>
    <path d="M7 10H17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M7 14H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
  
  icon.style.display = "none";
  document.body.appendChild(icon);
  
  // 点击图标时打开卡片生成器
  icon.addEventListener("click", () => {
    console.log("图标被点击");
    console.log("当前选中文本:", window.getSelection().toString());
    console.log("保存的选中文本:", selectedText);
    console.log("最后选中的文本:", lastSelectedText);
    
    const textToUse = lastSelectedText || selectedText;
    console.log("将使用的文本:", textToUse);
    
    if (textToUse) {
      openCardGenerator(textToUse);
    } else {
      console.error("没有可用的文本");
    }
  });
  
  icon.title = "生成金句卡片";
  
  return icon;
}

// 监听文本选择事件
document.addEventListener("mouseup", (e) => {
  const selection = window.getSelection();
  selectedText = selection.toString().trim();
  
  if (selectedText) {
    // 保存最后选中的文本
    lastSelectedText = selectedText;
    
    if (!selectionIcon) {
      selectionIcon = createSelectionIcon();
    }
    
    // 获取选中文本的位置
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // 显示图标在选中文本上方
    selectionIcon.style.display = "flex";
    selectionIcon.style.top = `${window.scrollY + rect.top - 40}px`;
    selectionIcon.style.left = `${window.scrollX + rect.left + rect.width / 2 - 10}px`;
  } else if (selectionIcon) {
    // 如果点击的不是图标本身，则隐藏图标
    if (!e.target.closest('.quote-card-selection-icon')) {
      selectionIcon.style.display = "none";
    }
  }
});

// 点击其他区域时隐藏图标
document.addEventListener("mousedown", (e) => {
  if (selectionIcon && !selectionIcon.contains(e.target)) {
    setTimeout(() => {
      selectionIcon.style.display = "none";
    }, 100);
  }
});

// 创建卡片生成器界面
function createCardGeneratorUI(text) {
  // 创建卡片生成器容器
  const container = document.createElement("div");
  container.className = "quote-card-generator-container";
  
  // 创建卡片生成器内容
  container.innerHTML = `
    <div class="quote-card-generator-modal">
      <div class="quote-card-generator-header">
        <h2>金句卡片生成器</h2>
        <button class="quote-card-generator-close-btn">&times;</button>
      </div>
      <div class="quote-card-generator-content">
        <div class="quote-card-preview" id="cardPreview">
          <div class="quote-card-text">${text}</div>
        </div>
        <div class="quote-card-controls">
          <div class="control-group">
            <label>主题风格</label>
            <div class="theme-selector">
              <button data-theme="simple" class="active">简约</button>
              <button data-theme="vintage">复古</button>
              <button data-theme="modern">现代</button>
            </div>
          </div>
          <div class="control-group">
            <label>背景颜色</label>
            <div class="color-selector">
              <div class="color-group">
                <span>纯色</span>
                <button data-color="bg-color-1" class="color-btn active"></button>
                <button data-color="bg-color-2" class="color-btn"></button>
                <button data-color="bg-color-3" class="color-btn"></button>
              </div>
              <div class="color-group">
                <span>渐变</span>
                <button data-color="bg-gradient-1" class="color-btn"></button>
                <button data-color="bg-gradient-2" class="color-btn"></button>
                <button data-color="bg-gradient-3" class="color-btn"></button>
              </div>
            </div>
          </div>
          <div class="control-group">
            <label>字体</label>
            <div class="font-selector">
              <button data-font="font-1" class="active">方正楷体</button>
              <button data-font="font-2">胡晓波男神体</button>
              <button data-font="font-3">站酷高端黑</button>
              <button data-font="font-4">思源宋体</button>
              <button data-font="font-5">系统宋体</button>
              <button data-font="font-6">系统黑体</button>
            </div>
          </div>
          <div class="control-group">
            <label>对齐方式</label>
            <div class="align-selector">
              <button data-align="left" class="active">左对齐</button>
              <button data-align="center">居中</button>
              <button data-align="right">右对齐</button>
            </div>
          </div>
          <div class="control-group">
            <label>导出格式</label>
            <div class="export-selector">
              <select id="exportFormat">
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
                <option value="webp">WEBP</option>
              </select>
              <select id="exportQuality">
                <option value="0.7">普通质量</option>
                <option value="0.85">高质量</option>
                <option value="1">最高质量</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="quote-card-generator-footer">
        <button id="downloadCardBtn" class="download-btn">下载卡片</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(container);
  
  // 添加关闭按钮事件
  const closeBtn = container.querySelector(".quote-card-generator-close-btn");
  closeBtn.addEventListener("click", () => {
    document.body.removeChild(container);
  });
  
  // 添加主题切换事件
  const themeButtons = container.querySelectorAll(".theme-selector button");
  themeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      themeButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      updateCardPreview();
    });
  });
  
  // 添加背景颜色切换事件
  const colorButtons = container.querySelectorAll(".color-btn");
  colorButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      colorButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      updateCardPreview();
    });
  });
  
  // 添加字体切换事件
  const fontButtons = container.querySelectorAll(".font-selector button");
  fontButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      fontButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      updateCardPreview();
    });
  });
  
  // 添加对齐方式切换事件
  const alignButtons = container.querySelectorAll(".align-selector button");
  alignButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      alignButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      updateCardPreview();
    });
  });
  
  // 添加下载按钮事件
  const downloadBtn = container.querySelector("#downloadCardBtn");
  downloadBtn.addEventListener("click", () => {
    const cardPreview = document.querySelector(".quote-card-preview");
    const format = document.querySelector(".export-format").value;
    const quality = document.querySelector(".export-quality").value === "high" ? 1.0 : 0.8;
    
    try {
      html2canvas(cardPreview, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      }).then(canvas => {
        // 转换为图片并下载
        let imgData;
        if (format === "png") {
          imgData = canvas.toDataURL("image/png");
        } else if (format === "jpg") {
          imgData = canvas.toDataURL("image/jpeg", quality);
        } else if (format === "webp") {
          imgData = canvas.toDataURL("image/webp", quality);
        }
        
        const link = document.createElement("a");
        link.download = `金句卡片_${new Date().getTime()}.${format}`;
        link.href = imgData;
        link.click();
      });
    } catch (error) {
      console.error("导出卡片时出错:", error);
      alert("导出卡片失败，请重试");
    }
  });
  
  // 更新卡片预览
  function updateCardPreview() {
    const cardPreview = document.getElementById("cardPreview");
    const activeTheme = container.querySelector(".theme-selector button.active").dataset.theme;
    const activeColor = container.querySelector(".color-btn.active").dataset.color;
    const activeFont = container.querySelector(".font-selector button.active").dataset.font;
    const activeAlign = container.querySelector(".align-selector button.active").dataset.align;
    
    // 清除所有类
    cardPreview.className = "quote-card-preview";
    
    // 添加新类
    cardPreview.classList.add(activeTheme, activeColor, activeFont, `align-${activeAlign}`);
  }
}

// 打开卡片生成器
function openCardGenerator(text) {
  // 检查是否已存在卡片生成器
  const existingGenerator = document.querySelector(".quote-card-generator-container");
  if (existingGenerator) {
    document.body.removeChild(existingGenerator);
  }
  
  // 创建新的卡片生成器
  createCardGeneratorUI(text);
}

// 监听来自背景脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("收到消息:", request);
  
  if (request.action === "openCardGenerator" && request.text) {
    console.log("准备打开卡片生成器，文本:", request.text);
    openCardGenerator(request.text);
    sendResponse({ success: true });
  }
  return true; // 保持消息通道开放，以支持异步响应
}); 