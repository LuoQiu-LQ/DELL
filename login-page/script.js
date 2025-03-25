document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.querySelector('.login-btn');

    // 表单提交处理
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // 禁用按钮防止重复提交
        loginBtn.disabled = true;
        loginBtn.textContent = '登录中...';

        // 简单验证
        if (!usernameInput.value.trim() || !passwordInput.value.trim()) {
            alert('请输入用户名和密码');
            resetButton();
            return;
        }

        // 模拟登录请求
        try {
            // 这里应该是实际的API请求
            // const response = await fetch('/api/login', {
            //     method: 'POST',
            //     body: JSON.stringify({
            //         username: usernameInput.value,
            //         password: passwordInput.value
            //     }),
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
            // });

            // 模拟延迟
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 模拟成功响应
            // if (response.ok) {
                alert('登录成功！');
                // 实际应用中这里会跳转到主页
                // window.location.href = '/dashboard';
            // } else {
            //     throw new Error('登录失败');
            // }
        } catch (error) {
            alert('登录失败: ' + error.message);
        } finally {
            resetButton();
        }
    });

    // 重置按钮状态
    function resetButton() {
        loginBtn.disabled = false;
        loginBtn.textContent = '登录';
    }

    // 输入框实时验证
    [usernameInput, passwordInput].forEach(input => {
        input.addEventListener('input', () => {
            loginBtn.disabled = !usernameInput.value.trim() || !passwordInput.value.trim();
        });
    });
});
