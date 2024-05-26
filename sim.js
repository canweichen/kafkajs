const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
  // 假设你已经有了 CSRF 令牌和其它必要的表单数据
  const formData = {
    '__LASTFOCUS': '',
    '__VIEWSTATE': 'Km0zl/seRpPz9CQrXvFYJW9xP4vtlzUq7G/lkqNWu65fzegvYvFCpAioBFbtj7REEH9stkGwjjuvYREcCrTKDDiajRMI4dVQoo/5MAy2+agFdU7ZlMvFJcI1Vxx/KJfBZRm7xBny8XUgQa/lemIO1M5xioLrw4pBY2U48MSmxHLLfKt3EDXKMF9p40a2igNyGHYUG6gbr/4BaWNX9JIS2nSNS5VPMn1JI+YxhCyPGFsRMDTXuayTDAmkCN1uwx0y8thnarr2ZmPe0bQDOBhWJ0qW+GRmrhgvV0nElXp/hTXCL4Qo3mGFAAeheypQxg2vJn54KoA/Y4xSJkMPyXWJ7T9FyDrUmxmwFn36c1PaWFugaTxn8h/urYCgnlFtgUjFbPZkHHo6kpidQWixJdby4YkJ/1UJB3yJdfdnbrcrJhrxRXNeppSnSOT4qwXoOiGlAI/hKCMOyb0R5T0mvQ69/GSkYARiJLdKT9O7TZEdLg8oX4QbnSIQzp7+cBrXYwsI7cFNqbprxHj/VcYXYez0DxuEmIkaq3yK3YA2iqv+qArmi54HX2rgIyktVjTHLixyJx7iYdGz3nl3UhzuyyOU4ZDAOiEpXfdYwPIWi0x9393z5bPGKVyekVEY2CIRPRH68T551PuYv4bGh8zquUOPpnV1dYqRZ7m1andNoSjMOMwfIP5kz+HrNUMu1A+JPmgPMZ77Bv0V5Gm3qrlxAjfXZ23vhNlU5/TR/UiQcgJXtIZH+gSkEoN4MH+BupTFNxSmoV73lnyz0S/N0xkG8SWbmE+RJY2ZxfZvEBTpOHLly75FU9mBAnx3a+utK6cJIDTrrvcd1qnn1mgtwz1699md/qdK0NMcn+xpaeHsxwsCPR/Q139fx+Nl9gtYTX1WjtogYr3B2LfQ7+iP+eiTe4otRf/vC6PGw44T4XgwcAUbI4TVKPZ8KIEZc7c3AMUAL7D7lSllIObbKbVCrWhw3NNroEnYhWNZdDUP3OWB8ZoXQeDk3Dvj1C2oeL5p8IyK94AT1/+Gb6Ab4QcNVxTJ2Q6PsjgjNlZXiC3uO12rw4diMWu2bLXfcdiR9SAG/ESQMDovAaauYKR3zKyy07zaGagqAOV/KxprGj7PBNDhR03S1HYtRKpX+LEFZTkvpJGwGYGd3eE5J8lfvxfA74GSN/XxEbmuF4KtVAfwfFHAkCFHt890vdG+046jtWV+HYLxu5KbgJWDfOXNfFxGPUeLW+ZLFJaaFjkd2obVt7FTyMIr8A3ZZylwwj73jRcl6CAH3bJl+qj6wOYRncDeWs0wjMX2ivL7/D8tt+z11tphZ0QsecSA/1SKVBwEcg7cw2Wp0dH8FNt1eCWOzmKnULvdTzRbGjdN3b54ZUWrAS87X4GVsIojP6DjhEIy2EvHKQxZSEfPB51swRA+RdQWtOZlEp2aI8NEJusPW5h86bJmFLNdyCkYqh03q7ash1fLGrAqPCbqrK24BWR6Jma3rAgS3gRPJTTQVzJD3AePuZiv3HIbnLeWBotoNer9lNZP/LR4WzDp2S2dWP5AWSP4/Lb2aScWwuLtdcSJ5nPHc2BAI0mYslKcSASmLk7r7v6vlQnfb0N1+BNxpHeKLsiqyPojVHOrI6un0Ha/Db7JU38SRQk6hcaEiJYh42HC+zMmn3UAuWvKeESsRAtdcOZwqbZJeiNtb4s262P41Ayqg0jfzRgqe7D/uGEVK95IeeoWcWrbFnrmuDiq8bqMeuvktKZ51FijJ65EEpk=',
    '__VIEWSTATEGENERATOR': '3B16042E',
    '__EVENTTARGET': '',
    '__EVENTARGUMENT': '',
    '__VIEWSTATEENCRYPTED': '',
    'ctl00$mainPageContent$umLoginControl$txtEmail': 'Jason.brown@unisco.com',
    'ctl00_mainPageContent_umLoginControl_txtPassword': 'Unistrans2024!',
    'ctl00$mainPageContent$umLoginControl$btnLogin': 'Login',
  };

  // 设置请求头，可能需要模拟浏览器的用户代理字符串
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cookie': "JavascriptCookie=escape('JavascriptEnabled'); ClassITCulture=en-US; BrowserCapabilityCookie=WriteTestCookie", 
    'withCredentials': true,
    'Host': 'classit.nmfta.org',
    'Origin': 'https://classit.nmfta.org',
    'Referer': 'https://classit.nmfta.org/all/Welcome.aspx?ReturnUrl=%2f',
    // 如果有 CSRF 令牌或其他特殊头部，也需要在这里设置
  };

  // 发送 POST 请求到登录页面
  try {
    const response = await axios.post('https://classit.nmfta.org/all/Welcome.aspx', formData, { headers });
    // 检查登录是否成功
    console.log(response.data)

    if (response.data.includes('success indicator')) {
      console.log('Logged in successfully');
      // 处理 cookies 以维持会话
    } else {
      // 登录失败 获取CSRF令牌
      const $ = cheerio.load(response.data);
      console.log($("input[name='__VIEWSTATE']").val());
      console.error('Login failed');
    }
  } catch (error) {
    console.error('An error occurred during login:', error);
  }
})();