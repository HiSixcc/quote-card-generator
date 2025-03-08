/**
 * @fileoverview 背景脚本，负责处理右键菜单和消息通信
 */

// 创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "generateQuoteCard",
    title: "生成金句卡片",
    contexts: ["selection"]
  });
  console.log("右键菜单已创建");
});

// 处理右键菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "generateQuoteCard" && info.selectionText) {
    console.log("右键菜单被点击，选中文本:", info.selectionText);
    
    // 向内容脚本发送消息，传递选中的文本
    chrome.tabs.sendMessage(tab.id, {
      action: "openCardGenerator",
      text: info.selectionText
    }, (response) => {
      // 检查是否有错误
      if (chrome.runtime.lastError) {
        console.error("发送消息时出错:", chrome.runtime.lastError);
      } else {
        console.log("消息发送成功，响应:", response);
      }
    });
  }
});

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("收到来自内容脚本的消息:", request);
  
  if (request.action === "getSelectedText") {
    sendResponse({ success: true });
  }
  return true; // 保持消息通道开放
}); 