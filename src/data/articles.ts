/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Article {
  id: string;
  titleAr: string;
  titleEn: string;
  categoryAr: string;
  categoryEn: string;
  readTimeAr: string;
  readTimeEn: string;
  excerptAr: string;
  excerptEn: string;
  contentAr: string;
  contentEn: string;
  image: string;
  tags: string[];
}

export const HEALTH_ARTICLES: Article[] = [
  {
    id: "1",
    titleAr: "أهمية شرب الماء في رحلة خسارة الوزن",
    titleEn: "The Importance of Water Intake for Weight Loss",
    categoryAr: "تغذية أساسية",
    categoryEn: "Basic Nutrition",
    readTimeAr: "5 دقائق",
    readTimeEn: "5 min",
    excerptAr: "اكتشف كيف يساعد الماء في حرق الدهون وتحسين عملية التمثيل الغذائي.",
    excerptEn: "Discover how water helps in fat burning and improving metabolism.",
    contentAr: "الماء هو العنصر الأهم في أي رحلة صحية. يساعد شرب الماء الكافي على الشعور بالشبع لفترة أطول، مما يقلل من استهلاك السعرات الحرارية غير الضرورية. كما أنه ضروري لعمل الكبد والكلى بشكل صحيح للتخلص من السموم والدهون.",
    contentEn: "Water is the most important element in any health journey. Drinking enough water helps feel full for longer, which reduces unnecessary calorie consumption. It is also essential for the proper functioning of the liver and kidneys to eliminate toxins and fats.",
    image: "https://images.unsplash.com/photo-1548919973-5dea585f217a?q=80&w=800&auto=format&fit=crop",
    tags: ["ماء", "خسارة وزن", "صحة"]
  },
  {
    id: "2",
    titleAr: "أفضل 5 أطعمة عربية غنية بالبروتين",
    titleEn: "Top 5 High-Protein Arabic Foods",
    categoryAr: "بناء عضلات",
    categoryEn: "Muscle Building",
    readTimeAr: "4 دقائق",
    readTimeEn: "4 min",
    excerptAr: "تعرف على الأطباق العربية التقليدية التي تدعم بناء عضلاتك.",
    excerptEn: "Learn about traditional Arabic dishes that support your muscle building.",
    contentAr: "المطبخ العربي غني بمصادر البروتين الصحية. الحمص، الفول، العدس، والمشاوي هي خيارات رائعة للرياضيين. العدس مثلاً يحتوي على كمية ممتازة من البروتين والألياف التي تحسن الهضم.",
    contentEn: "Arabic cuisine is rich in healthy protein sources. Hummus, fava beans, lentils, and grills are great options for athletes. Lentils, for example, contain an excellent amount of protein and fiber that improve digestion.",
    image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=800&auto=format&fit=crop",
    tags: ["بروتين", "أكلات عربية", "عضلات"]
  },
  {
    id: "3",
    titleAr: "كيف تتجنب الجوع العاطفي؟",
    titleEn: "How to Avoid Emotional Eating?",
    categoryAr: "صحة نفسية",
    categoryEn: "Mental Health",
    readTimeAr: "6 دقائق",
    readTimeEn: "6 min",
    excerptAr: "نصائح نفسية وعملية للسيطرة على الرغبة في الأكل عند التوتر.",
    excerptEn: "Psychological and practical tips to control the urge to eat when stressed.",
    contentAr: "الجوع العاطفي هو تناول الطعام استجابةً للمشاعر بدلاً من الجوع الجسدي. للسيطرة عليه، يجب أولاً تحديد المثيرات، ممارسة التأمل، والحرص على وجود وجبات خفيفة صحية دائماً.",
    contentEn: "Emotional eating is eating in response to emotions rather than physical hunger. To control it, one must first identify triggers, practice meditation, and ensure healthy snacks are always available.",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop",
    tags: ["نفسية", "عادات", "توعية"]
  },
  {
    id: "4",
    titleAr: "فوائد الصيام المتقطع للمبتدئين",
    titleEn: "Intermittent Fasting Benefits for Beginners",
    categoryAr: "أنظمة غذائية",
    categoryEn: "Diet Systems",
    readTimeAr: "7 دقائق",
    readTimeEn: "7 min",
    excerptAr: "كل ما تحتاج معرفته لبدء نظام الصيام المتقطع بشكل صحيح وآمن.",
    excerptEn: "Everything you need to know to start intermittent fasting correctly and safely.",
    contentAr: "الصيام المتقطع ليس حمية، بل هو نمط لتناول الطعام. يساعد في تحسين حساسية الأنسولين، تعزيز حرق الدهون، وزيادة التركيز الذهني. أشهر أنواعه هو نظام 16/8.",
    contentEn: "Intermittent fasting is not a diet, but an eating pattern. It helps improve insulin sensitivity, promote fat burning, and increase mental focus. The most popular type is the 16/8 system.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop",
    tags: ["صيام", "نمط حياة", "صحة"]
  }
];
