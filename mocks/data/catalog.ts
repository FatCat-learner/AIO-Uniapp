/**
 * 发现页四个品类的种子数据（动作 / 食物 / 计划 / 路书）。
 *
 * 从 src/pages/discover/index.vue 里抽出来的：页面直接吃这份种子，
 * 同时 `mocks/modules/catalog.ts` 用它作为 GET /api/actions|foods|plans|routes 的基础结果集，
 * 再按关键字/分组过滤，所以以后接后端时两边口径是一致的。
 */
import type { ActionRow, FoodRow, PlanRow, RouteRow } from '../types';

/** 动作库 */
export const ACTIONS: ActionRow[] = [
  { n: '杠铃卧推', part: '胸', sub: '中下胸', equip: '杠铃', target: '胸大肌 · 三头', last: '8 × 100 kg', pinned: true, times: 47 },
  { n: '上斜杠铃卧推', part: '胸', sub: '上胸', equip: '杠铃', target: '胸大肌上部', last: '4 × 60 kg', times: 31 },
  { n: '哑铃卧推', part: '胸', sub: '中下胸', equip: '哑铃', target: '胸大肌', last: '10 × 30 kg', pinned: true, times: 28 },
  { n: '器械推胸', part: '胸', sub: '中下胸', equip: '器械', target: '胸大肌', last: '3 × 60 kg', times: 19 },
  { n: '高位下拉', part: '背', sub: '背阔肌', equip: '器械', target: '背阔肌', last: '4 × 60 kg', times: 64 },
  { n: '引体向上', part: '背', sub: '背阔肌', equip: '自重', target: '背阔肌 · 二头', last: '自重 8', pinned: true, times: 52 },
  { n: '深蹲', part: '腿', sub: '股四头', equip: '杠铃', target: '股四头 · 臀大肌', last: '5 × 140 kg', pinned: true, times: 58 },
  { n: '罗马尼亚硬拉', part: '腿', sub: '腘绳肌', equip: '杠铃', target: '腘绳肌 · 臀', last: '4 × 90 kg', times: 41 },
  { n: '腿举', part: '腿', sub: '股四头', equip: '器械', target: '股四头 · 臀', last: '12 × 180 kg', times: 33 },
  { n: '哑铃侧平举', part: '肩', sub: '中束', equip: '哑铃', target: '三角肌中束', last: '12 × 8 kg', times: 22 },
  { n: '杠铃推举', part: '肩', sub: '前束', equip: '杠铃', target: '三角肌前束', last: '5 × 50 kg', times: 18 },
  { n: '绳索下压', part: '三头', sub: '外侧头', equip: '绳索', target: '三头肌', last: '12 × 25 kg', times: 36 },
  { n: '哑铃弯举', part: '二头', sub: '内侧头', equip: '哑铃', target: '肱二头', last: '12 × 12 kg', times: 14 },
  { n: '绳索夹胸', part: '胸', sub: '中下胸', equip: '绳索', target: '胸大肌内侧', last: '12 × 15 kg', times: 26 },
  { n: '站姿提踵', part: '小腿', equip: '器械', target: '腓肠肌', last: '15 × 60 kg', times: 12 },
  { n: '反向飞鸟', part: '肩', sub: '后束', equip: '哑铃', target: '三角肌后束', last: '12 × 6 kg', times: 9 },
  { n: '卷腹', part: '腹部', sub: '腹直肌', equip: '自重', target: '腹直肌', last: '3 × 20', times: 44 },
  { n: '杠铃耸肩', part: '斜方肌', equip: '杠铃', target: '斜方肌上部', last: '12 × 60 kg', times: 7 },
  { n: '腕弯举', part: '前臂', equip: '哑铃', target: '前臂屈肌', last: '15 × 10 kg', times: 5 },
  { n: '壶铃摇摆', part: '臀部', sub: '上臀', equip: '壶铃', target: '臀大肌 · 腘绳肌', last: '15 × 24 kg', times: 11 },

  /* 以下补齐左栏「部位」固定字段里有、但原来没有种子数据的组，
     让 config/discover.ts 的 PARTS / MUSCLE_SUBS 每一档都能在 UI 里看到 */
  { n: '哑铃肩前伸', part: '前锯肌', equip: '哑铃', target: '前锯肌', last: '12 × 6 kg', times: 6 },
  { n: '颈部伸展', part: '颈部', equip: '自重', target: '颈后肌群', last: '15 × 2', times: 4 },
  { n: '农夫行走', part: '功能性', sub: '髋', equip: '哑铃', target: '核心 · 斜方肌 · 握力', last: '3 × 40 m @ 24 kg', times: 8 },
  { n: '土耳其起立', part: '功能性', sub: '肩关节', equip: '壶铃', target: '肩 · 核心', last: '3 × 3 @ 16 kg', times: 5 },
  { n: '墙球投掷', part: '功能性', sub: '膝关节', equip: '器械', target: '股四头 · 肩', last: '4 × 12 @ 9 kg', times: 7 },
  { n: '平板支撑', part: '核心稳定', equip: '自重', target: '腹横肌 · 腹直肌', last: '3 × 60 s', times: 38 },
  { n: '死虫', part: '核心稳定', equip: '自重', target: '核心稳定', last: '3 × 12', times: 21 },
  { n: '肩胛骨回缩激活', part: '热身动作', sub: '上背', equip: '绳索', target: '中下斜方 · 菱形肌', last: '2 × 15', times: 30 },
  { n: '弹力带肩部热身', part: '热身动作', sub: '肩膀', equip: '自重', target: '三角肌后束 · 肩袖', last: '2 × 15', times: 26 },
  { n: '最伟大拉伸', part: '拉伸', sub: '大腿', equip: '自重', target: '髋屈肌 · 胸椎', last: '2 × 8 / 侧', times: 18 },
  { n: '站姿腘绳肌与小腿拉伸', part: '拉伸', sub: '腘绳肌', equip: '自重', target: '腘绳肌 · 腓肠肌', last: '2 × 30 s', times: 12 },
  { n: '跑步机慢跑', part: '有氧', equip: '器械', target: '心肺', last: '30 min @ 9 km/h', times: 44 },
  { n: '椭圆机', part: '有氧', equip: '器械', target: '心肺', last: '25 min', times: 17 },
  { n: '波比跳', part: '全身', equip: '自重', target: '全身', last: '4 × 15', times: 23 },
  { n: '平板支撑计时', part: '计时动作', equip: '自重', target: '核心', last: '90 s', times: 9 },
  { n: 'Tabata 波比跳', part: 'Tabata', equip: '自重', target: '全身 · 心肺', last: '8 × 20 s', times: 6 },
];

/** 食物库（数值统一按每 100 g） */
export const FOODS: FoodRow[] = [
  { n: '米饭', cat: '主食', src: '常见', kcal: 116, c: 25.9, p: 2.6, f: 0.3 },
  { n: '全麦面包', cat: '主食', src: '常见', kcal: 246, c: 41, p: 9, f: 3.4 },
  { n: '黑麦片', cat: '主食', src: '我的', kcal: 338, c: 60, p: 11, f: 2.5 },
  { n: '鸡胸肉', cat: '肉蛋奶', src: '常见', kcal: 133, c: 2.5, p: 19.4, f: 5 },
  { n: '水煮蛋', cat: '肉蛋奶', src: '我的', kcal: 143, c: 1.5, p: 13.3, f: 9.5 },
  { n: '澳牛纯牛奶', cat: '肉蛋奶', src: '已购', kcal: 54, c: 3.4, p: 3, f: 3.2 },
  { n: '西兰花', cat: '蔬果', src: '常见', kcal: 36, c: 4.3, p: 4.1, f: 0.6 },
  { n: '蓝莓', cat: '蔬果', src: '自定义', kcal: 57, c: 14.5, p: 0.7, f: 0.3 },
  { n: '牛油果', cat: '蔬果', src: '已购', kcal: 171, c: 7.4, p: 2, f: 15.3 },
  { n: '豆腐', cat: '豆类坚果', src: '常见', kcal: 82, c: 4.2, p: 8.1, f: 3.7 },
  { n: '杏仁', cat: '豆类坚果', src: '已购', kcal: 579, c: 21.6, p: 21.2, f: 49.9 },
];

/** 训练计划 */
export const PLANS: PlanRow[] = [
  { n: '推胸 + 三头 · 进阶', g: '我的', goal: '力量', d: '12 周 · 4 天/周 · 60 分钟', tags: ['进行中', '力量'], pct: 42 },
  { n: '减脂启动 · 4 周', g: '我的', goal: '减脂', d: '4 周 · 3 天/周 · 45 分钟', tags: ['进行中', '减脂'], pct: 18 },
  { n: '五分化力量', g: '推荐', goal: '力量', d: '8 周 · 5 天/周 · 75 分钟', tags: ['中级'] },
  { n: '推拉腿 · 上肢增肌', g: '推荐', goal: '增肌', d: '6 周 · 4 天/周 · 65 分钟', tags: ['中级', '增肌'] },
  { n: '一周三次全身', g: '推荐', goal: '增肌', d: '4 周 · 3 天/周 · 50 分钟', tags: ['新手', '增肌'] },
  { n: '4 周减脂启动', g: '收藏', goal: '减脂', d: '4 周 · 3 天/周 · 45 分钟', tags: ['入门', '减脂'] },
  { n: '深蹲线性计划', g: '收藏', goal: '力量', d: '10 周 · 3 天/周 · 70 分钟', tags: ['进阶', '力量'] },
  { n: '壶铃燃脂 20 分钟', g: '社区', goal: '有氧', d: '3 周 · 5 天/周 · 25 分钟', tags: ['有氧', '减脂'] },
  { n: '有氧基础 4 周', g: '社区', goal: '有氧', d: '4 周 · 3 天/周 · 40 分钟', tags: ['入门', '有氧'] },
];

/** 路书 */
export const ROUTES: RouteRow[] = [
  { n: '阿姆斯特丹运河环线', region: '全球', sport: '骑行', dist: '42 km', d: '骑行 · 2 小时 10 分 · 爬升 30 m' },
  { n: '勃朗峰 UTMB 环线', region: '全球', sport: '徒步', dist: '170 km', d: '徒步 · 46 小时 · 爬升 10,000 m' },
  { n: '环青海湖', region: '全国', sport: '骑行', dist: '360 km', d: '骑行 · 3 天 · 爬升 1,800 m' },
  { n: '五缘湾晨跑', region: '全国', sport: '跑步', dist: '5.2 km', d: '跑步 · 31 分钟 · 爬升 24 m' },
  { n: '武汉东湖绿道', region: '全国', sport: '徒步', dist: '15 km', d: '徒步 · 3 小时 · 爬升 60 m' },
  { n: '环岛路滨海线', region: '福建', sport: '骑行', dist: '12.4 km', d: '骑行 · 38 分钟 · 爬升 96 m' },
  { n: '鼓浪屿环岛跑', region: '福建', sport: '跑步', dist: '6.8 km', d: '跑步 · 40 分钟 · 爬升 40 m' },
  { n: '武夷山九曲溪', region: '福建', sport: '徒步', dist: '9 km', d: '徒步 · 3 小时 · 爬升 220 m' },
  { n: '广州珠江夜跑', region: '广东', sport: '跑步', dist: '8.4 km', d: '跑步 · 45 分钟 · 爬升 12 m' },
  { n: '惠州红花湖环湖', region: '广东', sport: '骑行', dist: '18 km', d: '骑行 · 1 小时 · 爬升 80 m' },
  { n: '成都绕城绿道', region: '四川', sport: '骑行', dist: '24 km', d: '骑行 · 1 小时 20 分 · 爬升 40 m' },
  { n: '龙泉山城市之眼', region: '四川', sport: '徒步', dist: '11 km', d: '徒步 · 3 小时 30 分 · 爬升 480 m' },
];
