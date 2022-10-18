let testSE = [
 {
    number: 0,
    text: "Вы являетесь гражданином одной из этих стран: Российская Федерация, Республика Беларусь, Республика Казахстан, Кыргызская Республика, Украина, Донецкая Народная Республика, Луганская Народная Республика?",
    next: [1, {
        answer: "Вы не можете стать самозанятым. Самозанятым может стать только гражданин одной из этих стран.",
        result: false ,
    }],
 },
  {
    number: 1,
    text: "Планируемый доход от деятельности меньше 2 400 000 рублей в год?",
    next: [2, {
        answer: "Вы не можете стать самозанятым. Доход самозанятого должен быть меньше 2 400 000 рублей в год.",
        result: false
    }],
 },
  {
    number: 2,
    text: "Планируете ли Вы нанимать работников по трудовому договору или, если Вы ИП, есть ли у Вас сейчас работники, работающие по трудовому договору?",
    next: [{
        answer: "Вы не можете стать самозанятым.",
        result: false,
    }, 3],
 },
  {
    number: 3,
    text: "Ваша деятельность связана (будет связана) с хотя бы одним из этих видов деятельности: перепродажа товаров или имущественных прав (кроме личных вещей: перепродать свой устаревший телефон Вы сможете), продажа подакцизных товаров или товаров, подлежащих обязательной маркировке, добыча или продажа полезных ископаемых?",
    next: [{
        answer: "Вы не можете стать самозанятым. Лицо, которое занимается данными видами деятельности не имеет права стать самозанятым.",
        result: false
    }, 4],
 },
  {
    number: 4,
    text: "Ваша деятельность связана (будет связана) с хотя бы одним из этих видов деятельности: предпринимательская деятельность в интересах другого лица на основании договоров поручения, комиссии или агентских договоров, кроме случая, указанного в следующем пункте, доставка товаров с получением платежей в пользу других лиц, кроме случаев, когда используется контрольно-кассовая техника, зарегистрированная этими другими лицами?",
    next: [{
        answer:"Вы не можете стать самозанятым. Лицо, которое занимается данными видами деятельности, не имеет права стать самозанятым.",
        result: false,
    },5],
 },
 {
    number: 5,
    text: "Планируете ли Вы осуществлять какую-либо из следующих видов деятельности: арбитражное управление, деятельность медиатора, оценочная деятельность, деятельность нотариуса, занимающегося частной практикой, адвокатская деятельность?",
    next: [{
        answer: "Вы не можете стать самозанятым. Лицо, которое занимается данными видами деятельности не имеет права стать самозанятым.",
        result: false
    },6],
 },
 {
    number: 6,
    text: "Вы являетесь государственным или муниципальным служащим?",
    next: [{
        answer: "Вы можете стать самозанятым, но только для целей сдачи в аренду жилых помещений.",
        result: true
    },7],
 },
 {
    number: 7,
    text: "Вы являетесь зарегистрированным ИП?",
    next: [{
        answer:"Вы можете стать самозанятым.",
        result: true
    },8],
 },
 {
    number: 8,
    text: "Вы, являясь ИП, применяете специальные налоговые режимы (упрощенная система налогообложения, система налогообложения для сельскохозяйственных товаропроизводителей) или ведете предпринимательскую деятельность, которая облагается НДФЛ?",
    next: [{
        answer:"Вы можете стать самозанятым, но в течение 1 месяца с момента, когда налоговая поставит вас на учет в качестве самозанятого. Вы обязаны направить в налоговый орган по месту жительства (или по месту предпринимательской деятельности) уведомление о прекращении применения специального налогового режима. Если Вы не уведомите, то статус самозанятого будет аннулирован.",
        result: true
    },
    {
        answer: "Вы можете стать самозанятым.",
        result: true
    }],
 }
];

let testDOC = [
    {
        number: 0,
        text: "Что вы хотите делать?",
        options: [ ["Сдавать свой автомобиль в аренду",1], ["Ремонтировать автомобиль",2], ["Работать таксистом",2]],
    },
    {
        number: 1,
        text: "Вы собираетесь возить арендатора на вашем автомобиле?",
        options: [["Да",2],["Нет",2]]
    },
    {
        number: 2,
        text: "Кто вы?",
        options: [["Самозанятый без статуса ИП",3],["Самозанятый со статусом ИП",3]],
    },
    {
        number: 3,
        text: "С кем хотите заключить договор?",
        options: [["С физлицом без статуса ИП", -1], ["С ИП", -1], ["С юрлицом", -1]],
    }
];

/*
* 0 - rent + 
*     0 - with
*     1 - without
* 1 - repair
* 2 - taxi
*/

let documents = [
  {
    code:"0000",
    link:"/documents/rent/with/(между_физлицами)_договор_аренды_транспортного_средства_с_экипажем.docx"
  },
  {
    code:"0001",
    link:"/documents/rent/with/(арендодатель_-_физлицо,_арендатор_-_ИП)_Договор_аренды_транспортного_средства_с_экипажем.docx"
  },
    {
    code:"0002",
    link:"/documents/rent/with/(арендодатель_-_физлицо,_арендатор_-_юрлицо)_договор_аренды_транспортного_средства_с_экипажем.docx"
  },
    {
    code:"0010",
    link:"/documents/rent/with/(арендодатель_-_ИП,_арендатор_-_физлицо)_Договор_аренды_транспортного_средства_с_экипажем.docx"
  },
    {
    code:"0011",
    link:"/documents/rent/with/(между_ИП)_Договор_аренды_транспортного_средства_с_экипажем.docx"
  },
    {
    code:"0012",
    link:"/documents/rent/with/(арендодатель_-_ИП,_арендатор_юрлицо)_Договор_аренды_транспортного_средства_с_экипажем.docx"
  },
  {
    code:"0100",
    link:"/documents/rent/without/(между_физлицами)_Договор_аренды_транспортного_средства_без_экипажа.docx"
  },
  {
    code:"0101",
    link:"/documents/rent/without/(арендодатель_-_гражданин,_арендатор_-_ИП)_Договор_аренды_транспортного_средства_без_экипажа.docx"
  },
    {
    code:"0102",
    link:"/documents/rent/without/(арендодатель_-_гражданин,_арендатор_-_юрлицо)_Договор_аренды_ТС_без_экипажа.docx"
  },
    {
    code:"0110",
    link:"/documents/rent/without/(арендодатель_-_ИП,_арендатор_-_физлицо)_Договор_аренды_транспортного_средства_без_экипажа"
  },
    {
    code:"0111",
    link:"/documents/rent/without/(между_ИП)_Договор_аренды_транспортного_средства_без_экипажа.docx"
  },
    {
    code:"0112",
    link:"/documents/rent/without/(арендодатель_-_ИП,_арендатор_-_юрлицо)_Договор_аренды_транспортного_средства_без_экипажа.docx"
  },
    {
    code:"100",
    link:"/documents/repair/(между_физлицами)_Договор_подряда_на_ремонт_транспортного_средства.docx"
  },
    {
    code:"101",
    link:"/documents/repair/(ФЛ+ИП)_Договор_подряда_на_ремонт_транспортного_средства.docx"
  },
      {
    code:"102",
    link:"/documents/repair/(ФЛ+ЮЛ)Договор_подряда_на_ремонт_транспортного_средства.docx"
  },
      {
    code:"110",
    link:"/documents/repair/(ИП+ФЛ)_Договор_подряда_на_ремонт_транспортного_средства.docx"
  },
    {
    code:"111",
    link:"/documents/repair/(между_ИП)_Договор_подряда_на_ремонт_транспортного_средства.docx"
  },
      {
    code:"112",
    link:"/documents/repair/(ИП+ЮЛ)_Договор_подряда_на_ремонт_транспортного_средства.docx"
  },
  
]; 

let questions = [
  {
    category:"Общие положения",
    options:[
      ["Как стать самозанятым?","Для того чтобы стать самозанятым, нужно пройти регистрацию. Есть три варианта, как это можно сделать:\n- через мобильное приложение «Мой налог» (доступно в AppStore или GooglePlay, понадобится только паспорт);\n- через личный кабинет самозанятого на сайте ФНС (для регистрации и входа нужны ИНН и пароль, который выдают в отделении налоговой, также доступна авторизация с помощью учетной записи Портала госуслуг);\n- через мобильное приложение одного из уполномоченных банков (например, Сбер).\nПосле регистрации вы сможете через приложения или личный кабинет самозанятого на сайте ФНС передавать информацию о своем доходе и платить с него налог."],
      ["Можно ли стать самозанятым, если я уже зарегистрирован как ИП?","Да, наряду с физическими лицами ИП может оформить и самозанятость (п. 1 ст. 2 Закона N 422-ФЗ)."],
      ["Что такое НПД?","Налог на профессиональный доход (НПД) - это специальный налоговый режим для физлиц, который позволяет вместо НДФЛ платить с дохода от деятельности (использования имущества) налог по более низкой ставке. Если Вы уже ведете деятельность в качестве ИП, то НПД дает возможность не платить НДС (с некоторыми исключениями) и обязательные страховые взносы за себя (ч. 8, 9, 11 ст. 2, ст. 10 Закона от 27.11.2018 N 422-ФЗ)."],
      ["Каков размер налога для самозанятых?","Если вы оказываете услуги физическим лицам, то налог с ваших доходов составит 4%, а если вы сотрудничаете с организациями – 6% (ст. 10 Закона N 422-ФЗ)."],
    ],
  },
    {
    category:"Чеки",
    options:[
      ["Что такое чек?","Чек – это документ, подтверждающий получение платежа за товары или услуги, которые получил клиент от самозанятого."],
      ["Как выписать чек?","Чтобы выписать чек, установите приложение “Мой налог” или обратитесь к сервисам для самозанятых, размещенных в банковских приложениях (например, “Свое дело” от Сбера). при помощи инструмента “Новая продажа” укажите размер дохода, сведения о клиенте, а также услугу или товар, за которые вы принимаете оплату. Чек будет сформирован автоматически."],
      ["Что будет, если вовремя не выдать чек?","Если самозанятый не выдал заказчику чек, то он понесет ответственность за уклонение от уплаты налогов. За первое нарушение плательщиков НПД штрафуют на 20% от суммы платежа, а за повторное нарушение в течение 6 месяцев — на 100% (ст. 129.13 НК РФ)."],
      ["Когда выдавать чек — до или после платежа?","Чек должен быть сформирован и передан покупателю (заказчику) в момент расчета. (п. 3 ст. 14 Закона N 422-ФЗ). Рекомендуем выдавать чек сразу после оплаты, а не до нее, поскольку тогда вы снизите риск конфликта с клиентом из-за неоплаченных услуг."],
      ["Что делать, если чек был выпущен ошибочно\\в данных чека есть ошибка?","Вы можете аннулировать чек в приложении «Мой налог» и в других сервисах банков, которыми Вы пользуетесь (например, “Свое дело” от Сбера). Аннулирование чеков не ограничено по времени.  Сумма предполагаемого налога при этом будет пересчитана."],
  ],
  },
    {
    category:"Возможности самозанятого",
    options:[
      ["Может ли самозанятый зарегистрировать товарный знак?","Согласно Федеральному закону от 28.06.2022 N 193-ФЗ, самозанятые могут зарегистрировать собственный товарный знак. Пока этот закон не вступил в силу, поэтому с регистрацией следует подождать до 28 июня 2023 года."],
      ["Обеспечивается ли пенсионное страхование для самозанятого?","Право на страховую пенсию имеют лица, на которых распространяется обязательное пенсионное страхование (застрахованные лица), круг которых определен законодательно. Однако самозанятые автоматически не попадает в круг этих лиц. Чтобы обеспечить пенсионное страхование, самозанятый может добровольно уплачивать налоговые взносы в приложении «Мой налог». (ч. 1 ст. 4 Закона от 28.12.2013 N 400-ФЗ)."],
      ["Можно ли быть самозанятым и работать по трудовому договору?","Да, самозанятый может быть наемным работником, но отношения будут заключены с ним именно как с физическим лицом. Доход, полученный от трудовой деятельности, не облагается НПД (п. 2. ст. 6 Закона N 422-ФЗ)."],
      ["Может ли самозанятый нанять сотрудников?","Нет, при применении режима НПД не допускается наём работников по трудовому договору (пп. 4 п. 2 ст. 4 Закона N 422-ФЗ). При этом можно привлекать других людей для работы по гражданско-правовому договору. Если вы все же хотите нанять сотрудников, вы можете зарегистрироваться в качестве индивидуального предпринимателя."],
      ["Нужно ли самозанятому заключать какой-либо договор с клиентом?","Закон не предусматривает обязательного заключения договора. Тем не менее, чтобы защитить себя, рекомендуем вам заключать с клиентами договор в зависимости от того, чем вы занимаетесь - оказываете услуги, изготавливаете товары на заказ."],
      ["Я сдаю помещение в аренду. Могу ли я стать самозанятым?","Да, сдача помещений в аренду дает возможность регистрации в качестве самозанятого, но при этом можно сдавать только жилые помещения (пп. 3, 4 п. 2 ст. 6 Закона N 422-ФЗ)."],
      ["Я занимаюсь перепродажей товаров. Могу ли я стать самозанятым?","Если Вы перепродаете товар, то Вы не можете стать самозанятым (пп. 2 п. 2 ст. 4 Закона N 422-ФЗ). Самозанятый может продавать товар, который хотя бы частично, но был произведен им самим."],
      ["На какой территории можно вести деятельность самозанятому?","Согласно п. 3 ст. 2 Закона N 422-ФЗ в случае ведения деятельности на территориях нескольких субъектов Российской Федерации для целей применения НПД физическое лицо самостоятельно выбирает субъект Российской Федерации, на территории которого им ведется деятельность. Закон не предусматривает выбор нескольких субъектов Российской Федерации при регистрации в качестве налогоплательщика НПД."],
      ["Какой субъект ведения деятельности указать, если я веду деятельность на территории всей страны\\нескольких субъектов?","Учитывая, что положения Закона N 422-ФЗ не содержат определения места ведения деятельности, осуществляемой дистанционно, до внесения изменений в Закон N 422-ФЗ, место ведения указанной деятельности может определяться по выбору налогоплательщика НПД: либо по месту нахождения налогоплательщика НПД, либо по месту нахождения покупателя (заказчика). (письмо ФНС России от 18.11.2019 N СД-4-3/23424@ \"О применении специального налогового режима \"Налог на профессиональный доход\")."],
      ["Должен ли самозанятый использовать контрольно-кассовую технику?","Контрольно-кассовую технику самозанятые граждане не используют (п. 2.2 ст. 2 Закона от 22.05.2003 N 54-ФЗ)."],
      ["Может ли военнослужащий\\госслужащий стать самозанятым?","Доходы государственных служащих, в том числе проходящих военную службу, не признаются объектом налогообложения НПД за исключением доходов от оказания услуг по сдаче в аренду (наем) жилого помещения, расположенного на территории Российской Федерации. ( пп. 4 п. 2 ст. 6 Закона N 422-ФЗ)."],
      ["Есть ли ограничение по месячному доходу самозанятых?","Законом не предусмотрено ограничение размера месячного дохода самозанятого. Однако помните, что за календарный год доход не может превышать 2,4 млн. рублей. (пп. 8 п.2 ст. 4 Закона N 422-ФЗ)."],
      ["Нужно ли самозанятому открывать отдельный счет в банке?","Отдельного открытия счета для операций по оплате услуг самозанятого законом не предусмотрено. Однако это будет удобнее для Вас."],
      ["Может ли самозанятый оказывать услуги иностранным лицам?","Да. При получении доходов от иностранного физического лица к таким доходам применяется налоговая ставка 4%.\nЕсли источником такого дохода выступает иностранное юридическое лицо, то такие доходы должны облагаться ставкой 6%. При этом в мобильном приложении \"Мой налог\" при отражении дохода нужно выбрать тип реализации \"Юридическому лицу или ИП\", отметить \"Иностранная организация\" и указать ее наименование.\n(Письмо ФНС России от 19.04.2019 N СД-4-3/7497@ \"О применении налога на профессиональный доход\")"],
      ["Может ли иностранный гражданин стать самозанятым?","В соответствии со ст. 5 закона N 422-ФЗ от 27.11.2018 граждане Евразийского экономического союза могут зарегистрироваться в России в качестве самозанятых. Помимо России в ЕАЭС входят Беларусь, Армения, Казахстан и Киргизия. Также предусмотрена возможность постановки на учет в качестве самозанятого граждан Украины, Донецкой Народной Республики и Луганской Народной Республики."],
      ["Можно ли снова стать самозанятым, если ранее отказался от применения специального налогового режима?","Вы можете в любое время беспрепятственно вновь встать на учет в налоговой в качестве самозанятого при отсутствии недоимки по налогу, задолженности по пеням и штрафам по налогу. (п. 11 ст. 5 Закона N 422-ФЗ)."],
      ["Когда самозанятый теряет статус?","Статус самозанятого может быть прекращен по собственному желанию гражданина путем подачи заявления в налоговой орган. Сделать это можно в приложении «Мой налог». \nКроме того, налоговый орган может самостоятельно аннулировать постановку на учет гражданина в качестве самозанятого, если обнаружит, что на дату постановки на учет гражданин не соответствовал требованиям закона, которые предъявлены для постановки гражданина на учет (п. 16. ст.5 Закона N 422-ФЗ)\nЕсли обстоятельства, при которых гражданин не может быть самозанятым, появились после постановки на учет, налоговый орган по собственной инициативе снимает гражданина с учета (п. 15 ст. 5 Закона N 422-ФЗ)"],
      ["Какой лимит дохода в год у самозанятого?","Применение специального налогового режима для самозанятых допускается, если сумма дохода гражданина за календарный год не превышает 2,4 млн. рублей. (пп. 8 п.2 ст. 4 Закона N 422-ФЗ). Если за год Ваш доход превысил 2,4 млн рублей, с сумы, превышающей максимум, следует уплатить НДФЛ (Письмо ФНС России от 20.02.2019 N СД-4-3/2899@ \"О применении налога на профессиональный доход\")."],
      ["Что может делать самозанятый?","Законодательно не закреплен конкретный перечень деятельности самозанятых.  Однако, закон предусмтаривает некоторые ограничения. Например, самозанятый не может перепродавать чужие товары, продавать подакцизные товары (например, спиртные напитки) или товары, подлежащие обязательной маркировке."],
      ["Самозанятый должен оформлять декларации соответствия на товар собственного производства? ","Если вы продаете товар физическим лицам — можно не оформлять. Проблема в том, что самозанятые, во-первых, не обязаны оформлять эти декларации, во-вторых, не могут. Для этого нужен другой статус.\n Такие сертификаты (декларации) могут запросить перекупщики вашего товара (ИП, ООО, маркетплейсы — у последних разные правила, могут и не просить). Так как они уже не могут продавать ваш товар без документов."],
    ],
  },
    {
    category:"Налоги и выплаты",
    options:[
      ["Как мне посчитать налог?","Рассчет налога происходит автоматически в приложении «Мой налог» в зависимости от Вашего дохода по ставкам: \n\tЕсли вы оказываете услуги физическим лицам - 4% \n\tЕсли вы сотрудничаете с организациями – 6% \n(ст. 10 Закона N 422-ФЗ)"],
      ["За налоговый период нет дохода. Нужно ли уплачивать налог?","Налог рассчитывается в приложении автоматически. Если в течение месяца дохода не было, то и налога не будет.\nПри этом если налог менее 100 рублей, то он перенесется на следующий месяц. (п. 2 ст. 11 Закона N 422-ФЗ)"],
      ["Нужно ли самозанятому сдавать отчетность?","Самозанятые освобождены от предоставления какой-либо отчетности как в отношении доходов, так и в отношении расходов (ст. 13 Закона N 422-ФЗ)."],
      ["Что будет если не платить налог на самозанятых?","В случае неуплаты налога в установленные законом сроки (не позднее 25 числа каждого месяца) налоговый орган пришлет уведомление с требованием об уплате налогов. Также будет начислена пеня за неуплату налога (п. 6 ст. 11 Закона N 422-ФЗ)."],
      ["Платят ли самозанятым алименты?","Да, с доходов самозанятых производится удержание алиментов (пп. «е» п. 2 Перечня видов заработной платы и иного дохода, из которых производится удержание алиментов на несовершеннолетних детей, утв. Постановлением Правительства РФ от 02.11.2021 N 1908)."],
      ["Какие льготы есть для самозанятых?","После регистрации каждый самозанятый получает налоговый бонус в размере 10 тысяч рублей. С его помощью вы можете снизить налоговую ставку с 6% до 4% и с 4% до 3%. (ст. 12 Закона N 422-ФЗ).\nТакже малоимущие граждане могут получить выплату в размере 250 тысяч на открытие своего дела. Помимо выплаты, самозанятые могут получить кредит на льготных условиях, пройти бесплатные тренинги и получить консультации."],      
    ],
  },
    {
    category:"Перевозка",
    options:[
      ["Нужно ли самозанятому таксисту получать лицензию?","Лицензия выдается таксистам, оформленным в качестве ИП. Лицензия также может быть выдана юридическому лицу.  Поэтому в случае, если Вы хотите оказывать услуги перевозки пассажиров, Вам необходимо работать через посредника."],
      ["Может ли самозанятый работать таксистом без договора с посредником?","Чтобы перевозить людей или багаж, необходимо получить соответствующую лицензию. Она выдается ИП или юридическим лицам. Поэтому если вы хотите работать в такси, вам следует заключить договор с лицом, у которого такая лицензия есть, например, с агрегатором, или же зарегистрироваться как ИП и получить лицензию."],
      ["Что будет, если работать в такси без лицензии?","Работа в такси без лицензии влечет ответственность по ст. ч. 2 ст. 14.1 КоАП РФ и грозит административным штрафом от 2000 до 2500 рублей.\nВ случае, если по требованию сотрудника полиции вы не сможете предоставить лицензию, вам грозит ответственность по ч. 2.1 ст. 12.3 КоАП РФ - административный штраф в размере 5000 рублей."],
    ],
  },
    {
    category:"Аренда транспортного средства (ТС)",
    options:[
      ["Может ли самозанятый сдавать ТС в аренду?","Да, сдача самозанятым ТС в аренду не запрещена и не предусматривает ограничений. На это указал Минфин в письме 17.02.2020 № 03-11-11/10799."],
      ["Кто будет платить штраф за нарушение ПДД на ТС, сданном в аренду?","Если арендатора остановит инспектор ГИБДД, то штрафы выпишут на водителя. Если нарушение зафиксирует камера, то штраф придет на владельца (ч. ч. 1 ст. 2.6.1 КоАП)."],
      ["Камера зафиксировала нарушение, за рулем был арендатор, штраф пришел мне. Что делать?","В течение 10 дней со дня получения копии постановления об административном правонарушении можно его обжаловать с указанием на то, что за рулем были не вы. Доказательствами могут выступать договор аренды автомобиля, а также показания свидетелей или лица, управлявшего автомобилем в момент фиксации нарушения (п. 27 ППВС от 25.06.2019 N 20). Обжаловать постановление можно в районный суд по месту фиксации нарушения (ст. 29.5 КоАП), в вышестоящий орган или вышестоящему лицу (ч. 3 ст. 28.6 КоАП)."],
      ["Как оформить ОСАГО, если я планирую сдавать ТС в аренду неопределенному кругу лиц?","Вы можете оформить страховку в отношении неограниченного количества лиц (п. 2 ст. 15 Федерального закона от 25.04.2002 N 40-ФЗ)."],
    ],
  },
      {
    category:"Ремонт транспортного средства (ТС)",
    options:[
      ["Могу ли я на территории частного дома открыть шиномонтаж и стать самозанятым без каких-либо разрешительных документов?","Прежде чем открыть шиномонтаж, вам следует узнать, какой вид разрешенного использования присвоен вашему земельному участку, на котором размещен частный дом. Узнать это вам поможет публичная кадастровая карта на сайте Росреестра (https://pkk.rosreestr.ru/#/). Виды разрешенного использования земельного участка делятся на основные, условно разрешенные, вспомогательные (п. 2 ст. 7 ЗК РФ). От принадлежности к одной из этих категорий зависит порядок изменения вида использования."],
      ["Могу ли я как самозанятый повесить на стену гаража баннер \"Шиномонтаж\" без согласования?","По общему правилу размещение рекламных конструкций требует согласования с органами местного самоуправления (ч. 9 ст. 19 Закона о рекламе). Однако в некоторых случаях подобные баннеры не признаются рекламой и не требуют согласования, например, если они являются указателями. За уточнением информации и согласованием размещения баннера вы можете обратиться в орган местного самоуправления через Госуслуги.   Отсутствие согласования грозит привлечением к административной ответственности по ст. 14.37 КоАП и штрафом от 1000 до 1500 рублей."],
    ],
  },
];

const express = require("express");
const { MongoClient } = require("mongodb");
var fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(express.static("img"));
app.use(fileUpload({}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
const port = 8080;

const uri = "mongodb+srv://anna:chatbot@chatbot.ne8nkkk.mongodb.net/chatbot?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let database;

(async () => {
  try {
    await client.connect();
    database = client.db("chatbot");

    const questionscol = database.collection("questions");

    for(let el of questions){
        questionscol.insertOne(el, function (err, result) {
      if (err) {
        return console.log(err);
      }
    });
    }
    console.log("DB done");
    await app.listen(port,(error) => {
    if (error) return console.log(`Error: ${error}`);
 
    console.log(`Server is listening on port ${port}`);
});
  } catch (err) {
    console.log(err)
    return;
  }
})();

