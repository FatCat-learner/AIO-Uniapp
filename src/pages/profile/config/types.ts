/** 资料块：头像首字 + 昵称 + 一句话签名 */
export interface ProfileUser {
  initial: string;
  name: string;
  meta: string;
}

/** 身体三指标的一格 */
export interface ProfileMetric {
  label: string;
  value: string;
  /** 目标列没有单位，空串时数值走 brand 色（模板里的 is-brand） */
  unit: string;
}

/** 设置 / 偏好列表的一行（tone 取值与 AppIconTile 的枚举一致） */
export interface ProfileSettingRow {
  icon: string;
  tone: 'train' | 'cardio' | 'diet' | 'body' | 'social';
  label: string;
  extra?: string;
}

/** 退出登录二次确认弹窗的定值文案 */
export interface ILogoutModal {
  title: string;
  content: string;
  confirmText: string;
  confirmColor: string;
}
