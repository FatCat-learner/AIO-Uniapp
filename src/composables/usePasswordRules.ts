import { computed } from 'vue';
import { PASSWORD_RULES } from '@/components/auth/constants';

/**
 * 密码规则与强度
 * 强度 = 命中的规则条数（0–4），与 4 段强度条一一对应
 */
export function usePasswordRules(source: () => string) {
  const rules = computed(() =>
    PASSWORD_RULES.map(rule => ({
      key: rule.key,
      label: rule.label,
      ok: !!source() && rule.test(source()),
    })),
  );

  const passed = computed(() => rules.value.filter(r => r.ok).length);
  const level = computed(() => (source() ? passed.value : 0));
  const text = computed(() => ['', '弱', '偏弱', '中', '强'][level.value] ?? '');
  const valid = computed(() => passed.value === PASSWORD_RULES.length);

  return { rules, passed, level, text, valid };
}
