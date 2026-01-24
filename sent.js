import {
    close_api,
    delay,
    send,
    startService
} from "./utils/utils.js";
import {
    execSync
} from 'child_process';

async function login() {

    const phone = process.env.PHONE

    if (!phone) {
        throw new Error("参数错误！请检查")
    }
    // 启动服务
    const api = startService()
    await delay(2000)
    console.log("开始发送验证码")
    try {
        const result = await send(`/captcha/sent?mobile=${phone}`, "GET", {})
        if (result.status === 1) {
            console.log("发送成功")
            execSync('git config --global user.email "github-actions[bot]@users.noreply.github.com"');
            execSync('git config --global user.name "github-actions[bot]"');
            try {
                execSync(`gh secret set PHONE -b"${phone}" --repo ${process.env.GITHUB_REPOSITORY}`);
                console.log("secret <PHONE> 更改成功")
            } catch (error) {
                throw new Error("secret <PHONE> 更改失败")
            }
        } else {
            console.log("响应内容")
            console.dir(result, {
                depth: null
            })
            throw new Error("发送失败！请检查")
        }
    } finally {
        close_api(api)
    }
    if (api.killed) {
        process.exit(0)
    }
}

login()