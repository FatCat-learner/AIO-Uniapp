import type { Ref } from 'vue';
import type { AuthCodeScene } from '@/api/auth/types';
import type { IAccountValue, IAuthNotice } from '@/components/auth/constants';
import { reactive, ref } from 'vue';
import { sendAuthCode } from '@/api/auth';
import { CODE_NOTICE_HINT_LOGIN, CODE_NOTICE_HINT_REUSE, CODE_NOTICE_TITLE } from '@/components/auth/constants';
import { toast } from '@/utils/ui';

/** 验证码输入框对外暴露的能力（VerifyCodeField 的 defineExpose） */
export interface ICodeFieldHandle {
  start: (seconds?: number) => void;
}

interface IUseAuthCodeOptions {
  account: Ref<IAccountValue>;
  accountText: Ref<string>;
  scene: AuthCodeScene;
  codeField: Ref<ICodeFieldHandle | null>;
}

/** 模拟码正文按场景选：验证码登录用「直接用它登录」，注册 / 改密用「直接填它继续」 */
const SCENE_HINT: Record<AuthCodeScene, string> = {
  login: CODE_NOTICE_HINT_LOGIN,
  register: CODE_NOTICE_HINT_REUSE,
  reset: CODE_NOTICE_HINT_REUSE,
};

/**
 * 取码链路：点「获取验证码」→ 先过图形码 → 真的发码 → 60 秒冷却 → 顶部展示模拟码
 * 验证码登录 / 注册① / 忘记密码① 三处逐字一致，只有 scene 与提示文案不同。
 */
export function useAuthCode(options: IUseAuthCodeOptions) {
  const { account, accountText, scene, codeField } = options;

  const notice = reactive<IAuthNotice>({ visible: false, title: '', message: '' });
  const captchaVisible = ref(false);

  function requestCode() {
    if (!accountText.value) {
      toast('请先填写账号');
      return;
    }
    captchaVisible.value = true;
  }

  async function onCaptchaPass() {
    captchaVisible.value = false;
    try {
      const res = await sendAuthCode({
        account_type: account.value.type,
        account: accountText.value,
        scene,
      });
      codeField.value?.start(60);
      // 开发期：后端直接把模拟码返回，顶部弹窗展示
      notice.visible = true;
      notice.title = CODE_NOTICE_TITLE;
      // 全角空格 U+3000 是原页面文案的一部分，用转义保留（源码里不出现该字符）
      notice.message = `${res?.code ?? ''}\u3000（${SCENE_HINT[scene]}）`;
    }
    catch (error: any) {
      toast(error?.message || '发送失败，请重试');
    }
  }

  return { notice, captchaVisible, requestCode, onCaptchaPass };
}
