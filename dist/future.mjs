import {L,STORIES} from './data.mjs';
const outlines={
wedding:[
['A question worth asking','值得一问','Proposal planning, ring, flowers, venue and photography','求婚计划、戒指、鲜花、场地与摄影'],
['Two families, one plan','两个家庭，一个计划','Family discussion, style, culture, guest list and total budget','家庭讨论、风格、文化、宾客名单及总预算'],
['Dates in the diary','日历上的日期','Marriage registration, venue and banquet quotations; deposits tracked separately from final balances','婚姻注册、场地与宴席报价；定金与尾款分开记录'],
['Making it your own','你们自己的庆祝','Photography, bridal / groom attire, invitations, styling, decoration, transport, catering; optional ceremonies and Guo Da Li','摄影、双方礼服、请柬、造型、布置、交通、餐饮；可选传统仪式与过大礼'],
['A day, and the life after','婚礼，以及婚后的生活','Vendor final balances, wedding day, honeymoon and final cost summary','供应商尾款、婚礼、蜜月及最终成本总结']
],home:[
['Which kind of home?','怎样的家？','Country, location, property type, new / subsale, down payment, loan rate and obligations','国家、地区、房产类型、新房／二手房、首付、利率与已有责任'],
['Beyond the brochure','宣传册之外','New: showroom and development review. Subsale: view, ownership information and optional inspection','新房：展厅与发展资料审阅。二手房：看房、产权资料与可选检查'],
['Before signing','签字之前','Affordability, financing, legal review, applicable duties and valuation; country-specific eligibility','负担能力、融资、法律审阅、适用印花税及估价；各国资格要求'],
['The keys and the surprises','钥匙与意外','New: construction / handover and defects. Subsale: completion and hidden defects conditional on condition, age and inspection','新房：施工／交付及缺陷。二手房：完成交易，按状况、房龄及检查确定潜在缺陷'],
['A place to live','生活的地方','Basic / light / major renovation, repairs, furniture, appliances, moving, fees, taxes, insurance and utilities','基本／轻度／大型装修、维修、家具、电器、搬家、管理费、税费、保险及水电']
],business:[
['An idea with a purpose','有方向的想法','Choose online service, retail, food and beverage, e-commerce or custom; research and customer validation','选择线上服务、零售、餐饮、电商或自定；研究与客户验证'],
['The practical beginning','务实地开始','Registration, relevant licences, budget, rental and deposits','注册、相关执照、预算、租金与押金'],
['Build the first version','建立第一版','Branding, equipment, software, website, inventory, suppliers, packaging and logistics','品牌、设备、软件、网站、库存、供应商、包装与物流'],
['Open for business','开始营业','Launch, marketing, staff, utilities, operating capital and contingency; supplier delays and refunds','启动、营销、人员、水电、营运资本与应急；供应延误和退款'],
['Learn from the numbers','从数字中学习','Operations, late customer payments, stock damage and performance review; simulated revenue stays separate from actual income','运营、客户延迟付款、库存损坏及绩效回顾；模拟营业收入独立于真实收入']
],education:[
['A direction to grow','成长的方向','Course selection, prerequisites and application costs','课程选择、入学要求与申请费用'],
['A place in class','课堂中的位置','Tuition deadlines, deposits and financial planning','学费期限、定金与财务规划'],
['Ready to learn','准备学习','Equipment, accommodation, moving and transportation','设备、住宿、搬家与交通'],
['Keep showing up','持续投入','Living expenses, examinations and material costs','生活开支、考试及材料费用'],
['A brighter future','明亮的未来','Graduation, final balances and financial review','毕业、尾款与财务回顾']
],living:[
['A space of your own','自己的空间','Rental search, location and actual affordability','租房搜索、地区与真实负担能力'],
['Read the small print','细读条款','Tenancy agreement, deposit and utility connection quotations','租约、押金与水电接通报价'],
['The first night','第一个晚上','Moving, safe essentials and furniture','搬家、安全必需品与家具'],
['The ordinary month','平常的一个月','Rent, utilities, groceries, maintenance and repair events','租金、水电、杂货、维护与维修事件'],
['Make yourself at home','安顿下来','Renewal, deposit review and ongoing responsibility','续约、押金审阅与持续责任']
],retirement:[
['Meet your future self','遇见未来的自己','Retirement goal, age, horizon and lifestyle','退休目标、年龄、时长与生活方式'],
['What is already growing?','已经在成长的是什么？','Existing savings, actual assets and projected expenses','已有储蓄、真实资产与预计开支'],
['Assumptions, gently tested','温和测试假设','Editable inflation, healthcare and return assumptions; no guaranteed investment outcome','可编辑通胀、医疗与回报假设；不保证投资结果'],
['A long, patient habit','长期耐心的习惯','Long-term contributions and stress tests without fictional income increases','长期供款及压力测试，不虚构收入增长'],
['Keep the plan alive','让计划保持活力','Periodic review, contribution adjustment and ongoing care','定期审阅、调整供款与持续照护']
]};
// Uses the same narrative, choice, cost, event and unlock contracts as playable chapters.
export const FUTURE=Object.fromEntries(Object.entries(outlines).map(([id,rows])=>[id,{id,status:'in-development',playable:false,budget:STORIES.find(s=>s.id===id).range,chapters:rows.map(([en,zh,costEn,costZh],i)=>({id:`${id}-${i}`,title:L(en,zh),act:i,intro:L(costEn,costZh),scene:id,choices:[{id:'simple',title:L('Choose a simpler scope','选择简单方案'),immediate:'reduce optional quoted costs',delayed:'smaller future obligations'},{id:'planned',title:L('Keep the planned scope','保留计划范围'),immediate:'retain quoted budget',delayed:'retain future obligations'}],costItems:[{id:`${id}-cost-${i}`,country:'configured',category:costEn,frequency:i===3?'recurring':'once',sourceUrl:null,lastVerified:null,status:'quotation-required'}],events:[{id:`${id}-event-${i}`,type:i===2?'conditional':'scheduled',probability:i===2?.15:1,maxOccurrences:1,description:L('Review a quotation or an applicable change in your plan.','审阅报价或计划中的适用变化。')}],savingsRequirement:{method:id==='retirement'?'long-term':'deadline-based',amount:'from-user-quotations'},nextConditions:['decision','due date','accepted checkpoint']}))} ]));
