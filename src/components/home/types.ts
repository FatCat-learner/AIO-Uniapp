/**
 * 首页训练相关组件共用的类型
 *
 * 7 项面板挑中的入口：前四项开训练 sheet，后三项跳页面。
 */
export type TrainingPick
  = | 'strength'
    | 'cardio'
    | 'hiit'
    | 'ball'
    | 'body'
    | 'period'
    | 'ai';
