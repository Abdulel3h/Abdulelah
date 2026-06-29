import type { BlogPost } from "@/data/blog";
import { formatBlogDate } from "@/data/blog";
import type { GlobalPulseItem } from "@/data/globalPulse";

export type BlogLanguage = "en" | "ar";

export type ArabicBlogPost = {
  title: string;
  subtitle: string;
  excerpt: string;
  readingTime: string;
  content: {
    intro: string;
    sections: {
      heading: string;
      body: string;
      bullets?: string[];
    }[];
    takeaway: string;
  };
};

/**
 * Najdi-professional Arabic translations of the blog articles, keyed by slug.
 * The English source of truth stays untouched in data/blog.ts (it also feeds
 * Agent Abdulelah and the sitemap), so this file is presentation-only.
 */
export const blogTranslationsAr: Record<string, ArabicBlogPost> = {
  "why-context-matters-more-than-prompts-in-ai-agents": {
    title: "ليش الـ Context أهم من الـ Prompt في الـ AI Agents؟",
    subtitle:
      "أقوى الـ AI Agents ما تتميز بصياغة أوامرها، بل بما تقدر تشوفه وتتذكره وتستخدمه وتنفذه بأمان.",
    excerpt:
      "جودة الـ Prompt مهمة، لكن الـ AI Agent الموثوق يعتمد على السياق: معرفة موثوقة، وذاكرة، وأدوات، وسياسات، وتاريخ المستخدم، والبيئة المحيطة بالنموذج.",
    readingTime: "قراءة 6 دقائق",
    content: {
      intro:
        "الـ Prompt الذكي يحسّن الإجابة، لكنه ما يكفي وحده ليحوّل نموذج اللغة إلى Agent يُعتمد عليه. لما يحتاج نظام الذكاء الاصطناعي يدعم شغل حقيقي، السؤال الأهم مو بس وش التعليمات اللي وصلته، بل وش السياق المفيد اللي كان حول هذه التعليمات.",
      sections: [
        {
          heading: "الـ Prompt مجرد طبقة واحدة",
          body:
            "الـ Prompt يقول للنموذج وش يسوي الآن. أما الـ Context Engineering فهي اللي تحدد وش يعرفه النظام قبل ما يرد، ووش يقدر يسترجعه من معلومات، وأي أدوات مسموح له يستخدمها، ووين لازم يوقف. هذا هو الفرق بين Demo مرتب ونظام يقدر الناس يثقون فيه.",
          bullets: [
            "قواعد النظام تحدد الهدف والأسلوب والحدود.",
            "استرجاع المعرفة يجيب المستندات الصحيحة في اللحظة المناسبة.",
            "الذاكرة تحفظ التاريخ المفيد بدون كشف بيانات ما لها داعي.",
            "الأدوات تخلي الـ Agent يتعامل مع أنظمة موثوقة بدل ما يخمّن."
          ]
        },
        {
          heading: "السياق يغيّر جودة القرارات",
          body:
            "تخيل مساعدين جامعيين يجاوبون على نفس سؤال الطالب. الأول ما يشوف إلا Prompt عام، والثاني يقدر يبحث في اللوائح الرسمية، ويفهم وضع الطالب، ويحترم قواعد الخصوصية، ويوضح من وين جاب إجابته. المساعد الثاني مو أفضل لأن صياغته أكثر إبداعًا، بل لأن بيئته أكثر مسؤولية."
        },
        {
          heading: "بنية الـ Agent العملية",
          body:
            "الـ Agent المفيد عادة يجمع النموذج مع مجموعة صغيرة من الطبقات المدروسة، وكل طبقة لازم تستحق مكانها بتحسين الدقة أو الأمان أو سهولة الاستخدام.",
          bullets: [
            "التعليمات: وش وظيفة الـ Agent ووش الممنوع عليه.",
            "الاسترجاع (Retrieval): مصادر المعرفة الموثوقة المتاحة للمهمة.",
            "الذاكرة: أقل قدر مفيد من التاريخ يضمن استمرارية المحادثة.",
            "الأدوات: الإجراءات اللي مسموح للـ Agent ينفذها.",
            "التقييم: فحوصات تكشف متى يكون الـ Agent غير متأكد أو غلطان."
          ]
        },
        {
          heading: "ابنِ البيئة، مو بس الـ Prompt",
          body:
            "كثير من الفرق تقضي وقت طويل في تعديل عبارات الـ Prompt بينما الفجوات الحقيقية في مكان ثاني: مستندات ناقصة، أو صلاحيات غير واضحة، أو تعريفات أدوات ضعيفة، أو غياب حلقة تغذية راجعة. تصميم الـ Prompt يظل مهم، لكنه يشتغل أفضل كجزء من استراتيجية سياق أوسع."
        }
      ],
      takeaway:
        "الـ AI Agent الموثوق هو نموذج داخل بيئة مصممة صح. سياق أفضل، وحدود أوضح، وأدوات موثوقة، غالبًا تصنع قيمة أكبر من إعادة كتابة الـ Prompt بلا نهاية."
    }
  },
  "local-ai-systems-and-the-future-of-university-services": {
    title: "أنظمة الـ AI المحلية ومستقبل الخدمات الجامعية",
    subtitle:
      "المساعد الجامعي يصير أكثر فائدة لما يفهم سياق المؤسسة ويتعامل مع الخصوصية كشرط تصميم من البداية.",
    excerpt:
      "مشروع ChatUB مثال عملي على ليش الجامعات تحتاج مساعدين AI يفهمون السياق ويحترمون الخصوصية ويستندون على المعرفة الأكاديمية الرسمية.",
    readingTime: "قراءة 6 دقائق",
    content: {
      intro:
        "الخدمات الجامعية فيها احتكاك أكثر مما نتوقع. الطالب يحتاج إجابات سريعة عن الإجراءات واللوائح والقرارات الأكاديمية، لكن المعلومة المطلوبة قد تكون موزعة بين مستندات وبوابات ومكاتب مختلفة. الذكاء الاصطناعي يقدر يساعد هنا، بشرط أن يكون النظام مصمم حول السياق الحقيقي للجامعة.",
      sections: [
        {
          heading: "الإجابات العامة ما تكفي",
          body:
            "الشات بوت العام ممكن يشرح مفهوم أكاديمي بشكل عام، لكن الطالب غالبًا يحتاج توجيه يخص جامعته بالذات: أي لائحة تنطبق على وضعه، ووش الخطوة الجاية، ووين يتأكد من الإجابة. المساعد الجامعي المفيد لازم يستند على محتوى رسمي."
        },
        {
          heading: "وش كان هدف ChatUB",
          body:
            "ChatUB، مشروع تخرج عبدالإله، صُمم كمساعد أكاديمي يعمل بنظام AI محلي لطلاب جامعة بيشة. توجهه ركّز على المستندات الأكاديمية الرسمية، والإجابات الواعية بالسياق، وبنية تحترم الخصوصية، بدل الإجابات العامة.",
          bullets: [
            "استخدام معرفة الجامعة الموثوقة كأساس للإجابات.",
            "شرح الإجراءات بلغة قريبة من الطالب.",
            "إبقاء خصوصية المؤسسة وموثوقيتها حاضرة في البنية التقنية.",
            "تأسيس قاعدة تدعم تبنّي الجامعة للنظام مستقبلًا."
          ]
        },
        {
          heading: "الـ AI المحلي خيار استراتيجي",
          body:
            "محلي ما تعني تلقائيًا مثالي، وكل نشر يحتاج تقييم دقيق. لكن الأنظمة المحلية أو الخاضعة لسيطرة المؤسسة تعطي الجامعات تحكم أكبر في البيانات الحساسة، وتحديث المعرفة، وسلوك النظام، وقرارات الحوكمة."
        },
        {
          heading: "ابدأ بخدمات محددة وعالية القيمة",
          body:
            "أفضل حالات الاستخدام الجامعية المبكرة غالبًا تكون ضيقة بما يكفي لتقييمها بوضوح: الأسئلة الأكاديمية الشائعة، والتنقل بين الإجراءات، والبحث في المستندات، وفرز طلبات الخدمات الطلابية، ودعم معرفة الموظفين. مساعد مركّز ممكن يكون أنفع من مساعد واسع يحاول يجاوب على كل شيء."
        }
      ],
      takeaway:
        "الـ AI الجامعي المفروض يُصمم كطبقة خدمة موثوقة: يستند على المعرفة الرسمية، وواضح في حدوده، ويفكر في الخصوصية من أول يوم."
    }
  },
  "from-chatbots-to-ai-agents-what-actually-changed": {
    title: "من الشات بوت إلى الـ AI Agents: وش اللي تغيّر فعلًا؟",
    subtitle:
      "التحول مو مجرد مسمى جديد، بل أنظمة تقدر تستخدم الأدوات وتمشي على خطوات عمل واضحة وتدعم القرارات.",
    excerpt:
      "الشات بوت يجاوب، أما الـ AI Agent فيشتغل على هدف كامل مستخدمًا السياق والأدوات والقواعد وخطوات عمل محددة. هذا هو الفرق بدون تعقيد.",
    readingTime: "قراءة 5 دقائق",
    content: {
      intro:
        "كلمتا شات بوت وAI Agent كثير ما تُستخدمان وكأنهما نفس الشيء. صحيح أن بينهما تداخل، لكن الفرق مهم. فهمه يساعد الفرق تختار مستوى التعقيد المناسب للمشكلة اللي عندهم فعلًا.",
      sections: [
        {
          heading: "الشات بوت يركز على المحادثة",
          body:
            "الشات بوت عادة يستقبل رسالة ويرجع رد. ممكن يجاوب على الأسئلة الشائعة، أو يشرح معلومة، أو يوجّه المستخدم بين خيارات معروفة. ولكثير من الخدمات، هذا بالضبط المطلوب."
        },
        {
          heading: "الـ Agent يقدر يتحرك داخل Workflow",
          body:
            "الـ Agent مصمم يشتغل نحو هدف. يقدر يقرر أي مصدر يرجع له، أو يستخدم أداة، أو يقارن النتائج، أو يطلب معلومة ناقصة، أو يوقف لما تتطلب القاعدة مراجعة بشرية.",
          bullets: [
            "يسترجع مستند قبل ما يجاوب على سؤال يخص سياسة معينة.",
            "يتحقق من نظام قبل ما يبلغ عن حالة طلب.",
            "يلخص الخيارات ويعلّم على نقاط عدم التأكد لصانع القرار.",
            "يمشي على خطوات معتمدة بالتسلسل بدون ما يتجاوز الضوابط."
          ]
        },
        {
          heading: "قدرات أكثر تعني مسؤولية أكبر",
          body:
            "كل أداة إضافية أو خطوة جديدة في الـ Workflow تفتح أسئلة جديدة: وش المسموح للـ Agent يوصل له؟ وأي إجراءات تحتاج تأكيد؟ وكيف تنكشف الأخطاء؟ ومتى يتدخل الإنسان؟ تصميم الـ Agent الجيد يتعلق بالحدود بقدر ما يتعلق بالذكاء."
        },
        {
          heading: "اختر أبسط نظام مفيد",
          body:
            "مو كل مشكلة تحتاج Workflow مستقل بقرارات ذاتية. مساعد استرجاع واضح ممكن يحل حاجة المستخدم أفضل من Agent معقد. الهدف مو إضافة أحدث مسمى، الهدف بناء أصغر نظام موثوق يصنع قيمة."
        }
      ],
      takeaway:
        "التغيير الجوهري من الشات بوت إلى الـ Agent هو الفعل المنضبط: استخدام السياق والأدوات لخدمة هدف، مع احترام حدود واضحة."
    }
  },
  "how-ai-can-support-smarter-urban-planning": {
    title: "كيف يدعم الذكاء الاصطناعي تخطيطًا حضريًا أذكى؟",
    subtitle:
      "البيانات وخدمات الـ Cloud والـ AI القابل للتفسير تساعد المدن تاخذ قرارات أدق حول الراحة الحرارية.",
    excerpt:
      "مشروع Althil يوضح كيف يساعد الـ AI المخططين الحضريين على فهم التعرض الحراري ومسارات الشمس ومواقع المظلات لدعم مدن أكثر راحة.",
    readingTime: "قراءة 6 دقائق",
    content: {
      intro:
        "المدن تواجه أسئلة عملية تجمع بين البيانات والبيئة وتجربة الإنسان. وين تضيف المظلات أكبر تحسين لراحة المشاة؟ وكيف يقارن المخططون بين المواقع عبر الزمن؟ الذكاء الاصطناعي مفيد هنا لما يدعم القرار، مو لما يدّعي أنه بديل عن المخطط.",
      sections: [
        {
          heading: "الراحة الحضرية مشكلة قرار",
          body:
            "التعرض الحراري مو موحد. كل موقع له نمط مختلف حسب الوقت ومسارات الشمس والمباني المحيطة وحركة الناس في المكان. تخطيط تظليل أفضل يحتاج نظرة مكانية وتحليلية في نفس الوقت."
        },
        {
          heading: "وش استكشف Althil",
          body:
            "Althil طُوّر خلال هاكاثون Intelligent Planet من KFUPM بالتعاون مع Google Cloud. فكرة المنصة تساعد المخططين على تحديد المواقع الفعالة لمظلات التظليل باستخدام التعرض الحراري ومسارات الشمس وبيانات المواقع والتحليل البصري وطبقة شرح تحاورية للنتائج.",
          bullets: [
            "خرائط للتفاعل المرتبط بالمكان.",
            "تصوير حراري يخلي نقاشات التخطيط أوضح.",
            "تحليل سحابي للتعامل مع بيانات المواقع المنظمة.",
            "توصيات مدعومة بالـ AI تظل قابلة للتفسير للمستخدمين."
          ]
        },
        {
          heading: "الـ Cloud AI يربط الطبقات ببعضها",
          body:
            "البنية السحابية تقدر تربط التحليلات والتقارير والتخزين والعرض المرئي وطبقة الشرح. في Althil، خدمات مثل Cloud Run وBigQuery وCloud Storage وVertex AI شكّلت التوجه التقني المقترح."
        },
        {
          heading: "الـ AI لازم يسهّل فحص القرار",
          body:
            "أكثر أنظمة التخطيط قيمة ما تختبئ وراء رقم أو درجة. هي تساعد المستخدم يفهم ليش الموقع مهم، ويقارن السيناريوهات، ويدخل الحكم البشري في القرار النهائي."
        }
      ],
      takeaway:
        "الذكاء الاصطناعي يدعم مدنًا أذكى لما يحوّل البيانات البيئية إلى دعم قرار مفهوم، مع بقاء المخططين أصحاب الكلمة الأخيرة."
    }
  },
  "from-reactive-security-to-predictive-ai-security": {
    title: "من الأمن التفاعلي إلى أمن الـ AI التنبؤي",
    subtitle:
      "الإشارات السلوكية تساعد فرق الأمن على ملاحظة الأنماط غير الاعتيادية مبكرًا والتحقيق بسياق أفضل.",
    excerpt:
      "أمن الـ AI يقدر يتجاوز مرحلة رد الفعل بعد الحوادث، باستخدام التحليلات السلوكية وكشف الشذوذ ولوحات دعم القرار لرصد أنماط الخطر مبكرًا.",
    readingTime: "قراءة 6 دقائق",
    content: {
      intro:
        "أنظمة الأمن غالبًا ما تظهر للواجهة إلا بعد وقوع الخطأ. تسجيل دخول مريب، أو تسلسل غير معتاد من الإجراءات، أو تغير مفاجئ في النمط، قد لا يُلاحظ إلا لما تنطلق قاعدة معينة. الذكاء الاصطناعي يساعد الفرق على التحقيق في الخطر مبكرًا من خلال قراءة السلوك داخل سياقه.",
      sections: [
        {
          heading: "تنبؤي ما تعني مؤكد",
          body:
            "ما ينبغي التعامل مع الـ AI كآلة تتنبأ بالحوادث بدقة مطلقة. قيمته أضيق وأكثر عملية: يقدر يبرز الأنماط اللي تستحق الانتباه، ويرتب أولويات التحقيق، ويعطي المحللين نقطة بداية أقوى."
        },
        {
          heading: "السلوك يضيف سياقًا مفيدًا",
          body:
            "تحليلات سلوك المستخدمين والكيانات، المعروفة بـ UEBA، تقارن أنماط النشاط عبر الزمن. لما يتغير السلوك بشكل غير معتاد، يقدر فريق الأمن يفحص الإشارة مع بقية الأدلة.",
          bullets: [
            "كشف أنماط وصول أو تسلسلات غير اعتيادية.",
            "مقارنة النشاط مع خط أساس معروف.",
            "ترتيب الإشارات حسب الخطورة بدل التعامل مع كل تنبيه بنفس الدرجة.",
            "تزويد المحللين بلوحة تحكم لمراجعة واعية."
          ]
        },
        {
          heading: "وش استكشف Absher Insight AI",
          body:
            "Absher Insight AI طُوّر كمفهوم استباقي للأمن الرقمي خلال هاكاثون Absher Tuwaiq. المفهوم استخدم البيانات الاصطناعية والتحليلات السلوكية وكشف الشذوذ وتفكير لوحات التحكم لاستكشاف تنبؤ بالمخاطر يراعي الخصوصية."
        },
        {
          heading: "المراجعة البشرية تظل أساسية",
          body:
            "أمن الـ AI المفروض يدعم المحللين، مو يصدر أحكام غير مفسرة على الناس. الفرق تحتاج إشارات شفافة، وحوكمة دقيقة، وحماية للخصوصية، ومسارات مراجعة للإنذارات الخاطئة."
        }
      ],
      takeaway:
        "أمن الـ AI التنبؤي يكون أكثر مصداقية لما يساعد البشر على ملاحظة أنماط الخطر المهمة مبكرًا، مع خصوصية وشفافية ومراجعة مدمجة في النظام."
    }
  },
  "what-every-student-should-know-about-ai-in-2026": {
    title: "وش يحتاج كل طالب يعرفه عن الـ AI في 2026؟",
    subtitle:
      "الإلمام بالذكاء الاصطناعي صار ميزة عملية في كل تخصص، مو بس علوم الحاسب.",
    excerpt:
      "دليل عملي للطلاب من أي تخصص: افهم وش يقدر الـ AI يسوي، واستخدمه بمسؤولية، وابنِ ميزة مهنية عبر أسئلة أفضل ومشاريع حقيقية.",
    readingTime: "قراءة 7 دقائق",
    content: {
      intro:
        "الطالب ما يحتاج يصير باحث Machine Learning عشان يستفيد من الـ AI. لكنه يحتاج تصور ذهني واضح، وعادات مسؤولة، وخبرة عملية تكفي ليعرف وين يساعده الـ AI ووين ممكن يضلله.",
      sections: [
        {
          heading: "ابدأ بالفهم، مو بالضجة",
          body:
            "تعلم المفردات الأساسية: النماذج، والـ Prompts، والسياق، والاسترجاع، والهلوسة (Hallucinations)، والخصوصية، والتقييم، والأتمتة. ما تحتاج رياضيات متقدمة عشان تبدأ. تحتاج تفهم نوع النظام اللي تستخدمه ووش الدليل اللي يدعم إجابته."
        },
        {
          heading: "استخدم الـ AI شريك تفكير",
          body:
            "الـ AI يساعدك ترتب أفكارك وتقارن وتتدرب وتشرح وتراجع. لكنه ما يفترض يستبدل حكمك أو ينتج شغل ما تقدر تدافع عنه. أقوى المستخدمين هم اللي يسألون أسئلة أفضل ويتحققون من الأجزاء المهمة.",
          bullets: [
            "اطلب شرح بمستويات صعوبة مختلفة.",
            "استخدم الـ AI لاكتشاف الفجوات في فهمك.",
            "تحقق من المعلومات عبر مصادر المقرر أو المجال الموثوقة.",
            "تجنب مشاركة بيانات أكاديمية أو شخصية أو مؤسسية خاصة."
          ]
        },
        {
          heading: "ابنِ مشروع صغير في تخصصك",
          body:
            "طالب إدارة الأعمال يقدر يحلل خطوات عمل خدمة معينة. وطالب التصميم يقدر يصمم نموذج أولي لتجربة AI أوضح. وطالب نظم المعلومات يقدر يبني مساعد معرفي. المشاريع التطبيقية الصغيرة تثبت أنك تقدر تربط الـ AI بحاجة حقيقية."
        },
        {
          heading: "الميزة المهنية تجي من الدمج",
          body:
            "أكثر الفرص إثارة غالبًا تكون بين التخصصات: AI والتعليم، وAI والمالية، وAI والاستدامة، وAI والخدمات العامة. تخصصك الحالي يصير أعلى قيمة لما تفهم كيف يدعمه الـ AI بمسؤولية."
        }
      ],
      takeaway:
        "تعامل مع الـ AI كطبقة جديدة من الإلمام المهني: تعلم المفاهيم، واحمِ الخصوصية، وتحقق من المخرجات المهمة، وابنِ شيء مفيد في مجالك."
    }
  },
  "ai-for-non-technical-people-a-simple-mental-model": {
    title: "الـ AI لغير التقنيين: تصور ذهني بسيط",
    subtitle:
      "فكر في الـ AI كنظام يجمع المدخل والسياق والأدوات والحدود ليطلع نتيجة مفيدة.",
    excerpt:
      "نموذج مبسط لفهم منتجات الـ AI بدون الغرق في المصطلحات، سواء كنت تدير عمل أو تدرس تخصص آخر أو تاخذ قرارات.",
    readingTime: "قراءة 5 دقائق",
    content: {
      intro:
        "شرح الـ AI ممكن يتعقد بسرعة. التصور الأبسط غالبًا أنفع: منتج الـ AI ياخذ مدخل، ويدمجه مع السياق والأدوات المسموحة، ويطلع مخرج داخل مجموعة من الحدود.",
      sections: [
        {
          heading: "أربعة أجزاء تكفي للبداية",
          body: "تقدر تفهم كثير من منتجات الـ AI بأربعة أسئلة.",
          bullets: [
            "المدخل: وش السؤال أو المستند أو الصورة أو الإشارة اللي تدخل النظام؟",
            "السياق: وش المعلومات الخلفية المفيدة اللي يشوفها النظام؟",
            "الأدوات: وش يقدر النظام يبحث عنه أو يحسبه أو يحدّثه؟",
            "الحدود: وش لازم يتجنبه أو يتأكد منه أو يحوّله لإنسان؟"
          ]
        },
        {
          heading: "مثال قريب",
          body:
            "خذ مساعد AI لجامعة. سؤال الطالب هو المدخل. واللوائح الأكاديمية الرسمية هي السياق. والبحث أداة. وقواعد الخصوصية ومسارات التصعيد هي الحدود. النموذج مهم، لكن النظام كامل هو اللي يصنع الخدمة."
        },
        {
          heading: "اسأل عن القيمة قبل التقنية",
          body:
            "فرق الأعمال ما تحتاج تبدأ باختيار النموذج. ابدأ بخطوات العمل نفسها: وين يضيع وقت الناس؟ وأي قرارات تحتاج معلومات أفضل؟ ووش الأخطاء اللي تكلفتها عالية؟ وأي بيانات حساسة؟"
        },
        {
          heading: "دوّر على دور واضح للإنسان",
          body:
            "منتجات الـ AI الموثوقة تخلي المسؤولية البشرية ظاهرة. الناس لازم يعرفون متى تحتاج الإجابة مراجعة، وكيف يصححون النظام، ووش الأشياء اللي النظام مو مصمم يقررها."
        }
      ],
      takeaway:
        "ما تحتاج خلفية تقنية عميقة عشان تسأل أسئلة AI صحيحة. ركز على المدخل والسياق والأدوات والحدود، والقرار البشري اللي صُمم النظام لدعمه."
    }
  },
  "building-ai-products-accuracy-is-not-enough": {
    title: "بناء منتجات الـ AI: الدقة وحدها ما تكفي",
    subtitle:
      "منتج الـ AI الموثوق يكسب الثقة عبر الاعتمادية والخصوصية وسهولة الاستخدام والتقييم وحدود صريحة.",
    excerpt:
      "منتجات الـ AI الجيدة تحتاج أكثر من نموذج دقيق: خطوات عمل موثوقة، وتجربة استخدام واضحة، وخيارات خصوصية، وحلقات تغذية راجعة، وتقييم، وخطة للتعامل مع عدم التأكد.",
    readingTime: "قراءة 7 دقائق",
    content: {
      intro:
        "النموذج ممكن يحقق نتائج ممتازة في الاختبار ومع ذلك يطلع منتج ضعيف. المستخدم يعيش تجربة النظام كامل: الواجهة، وسرعة الاستجابة، وخيارات الخصوصية، وحالات الفشل، والتفسيرات، واللحظة اللي يحتاج فيها الإنسان يتدخل.",
      sections: [
        {
          heading: "الدقة مقياس واحد، مو المنتج كله",
          body:
            "الفرق لازم تقيس هل الإجابات مفيدة وصحيحة، وكذلك هل النظام يتصرف بثبات تحت الظروف الحقيقية. المنتج اللي يبهر في الـ Demo ويربك في الاستخدام اليومي ما راح يصنع قيمة تدوم."
        },
        {
          heading: "الثقة تنبني داخل خطوات العمل",
          body:
            "المستخدم يحتاج إشارات تساعده يحكم على مخرجات الـ AI: مراجع المصادر، وعدم التأكد الظاهر، وخطوات المراجعة، وشرح بلغة بسيطة، وحدود مدروسة لما يقدر الـ AI يسويه.",
          bullets: [
            "الاعتمادية: هل يتصرف المنتج بثبات؟",
            "الخصوصية: هل تُدار البيانات بحدود مقصودة؟",
            "تجربة الاستخدام: هل يفهم المستخدم وش صار ووش الخطوة الجاية؟",
            "التقييم: هل تُقاس الأخطاء وتتحسن مع الوقت؟",
            "الحدود: هل يوقف النظام لما يحتاج القرار حكم بشري؟"
          ]
        },
        {
          heading: "النشر يغيّر الأسئلة",
          body:
            "أول ما يطلع منتج الـ AI من مرحلة النموذج الأولي، تحتاج الفرق تراقب الأداء والتكاليف والأخطاء وملاحظات المستخدمين وتغيّر المعرفة. المنتج يحتاج نموذج تشغيل كامل، مو مجرد منفذ API للنموذج."
        },
        {
          heading: "منتجات الـ AI الجيدة صادقة",
          body:
            "أفضل التجارب ما تبالغ في قدرات الـ AI. هي توضح هدف النظام، وتعبّر عن عدم التأكد، وتعطي المستخدم خطوة عملية تالية لما يوصل الـ AI لحدوده."
        }
      ],
      takeaway:
        "ابنِ الـ AI كمنتج يُعتمد عليه، مو كاستعراض نموذج. الدقة تهم أكثر لما ترافقها الخصوصية وسهولة الاستخدام والتقييم ومسؤولية بشرية واضحة."
    }
  }
};

export const blogCategoryLabelsAr: Record<string, string> = {
  All: "الكل",
  "AI Agents": "الـ AI Agents",
  "AI Fundamentals": "أساسيات الذكاء الاصطناعي",
  "Education AI": "الذكاء الاصطناعي في التعليم",
  "AI Security": "أمن الذكاء الاصطناعي",
  "AI for Sustainability": "الذكاء الاصطناعي للاستدامة",
  "AI for Students": "الذكاء الاصطناعي للطلاب",
  "AI for Everyone": "الذكاء الاصطناعي للجميع",
  "AI Product Thinking": "بناء منتجات الذكاء الاصطناعي"
};

export const blogAudienceLabelsAr: Record<string, string> = {
  "All audiences": "كل القرّاء",
  Everyone: "الجميع",
  Students: "الطلاب",
  Developers: "المطورون",
  Business: "قطاع الأعمال",
  Recruiters: "مسؤولو التوظيف",
  "Decision-makers": "صنّاع القرار",
  Universities: "الجامعات",
  Cities: "المدن",
  Cybersecurity: "الأمن السيبراني",
  Government: "القطاع الحكومي",
  Product: "فرق المنتجات"
};

// Technical tags (LLMs, RAG, UEBA, ChatUB...) intentionally stay in English;
// only plain-language tags get an Arabic label.
export const blogTagLabelsAr: Record<string, string> = {
  Memory: "الذاكرة",
  Education: "التعليم",
  Privacy: "الخصوصية",
  Chatbots: "الشات بوت",
  Automation: "الأتمتة",
  Tools: "الأدوات",
  Sustainability: "الاستدامة",
  "Smart Cities": "المدن الذكية",
  "AI Learning": "تعلّم الـ AI",
  Careers: "المسار المهني",
  Skills: "المهارات",
  Productivity: "الإنتاجية",
  "AI Basics": "أساسيات الـ AI",
  "Decision-making": "اتخاذ القرار",
  Trust: "الثقة",
  Deployment: "النشر"
};

const sourceLabels: Record<BlogLanguage, Record<BlogPost["sourceType"], string>> = {
  en: {
    original: "Original insight",
    curated: "Curated insight",
    "global-pulse": "Global pulse"
  },
  ar: {
    original: "مقال أصلي",
    curated: "محتوى منتقى",
    "global-pulse": "نبض عالمي"
  }
};

export function formatBlogDateAr(date: string) {
  return new Intl.DateTimeFormat("ar-SA-u-ca-gregory-nu-latn", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric"
  }).format(new Date(date));
}

export type LocalizedBlogPostView = {
  title: string;
  subtitle: string;
  excerpt: string;
  readingTime: string;
  categoryLabel: string;
  audienceLabels: string[];
  tagLabels: string[];
  dateLabel: string;
  sourceLabel: string;
  content: BlogPost["content"];
};

export function localizeBlogPost(
  post: BlogPost,
  language: BlogLanguage
): LocalizedBlogPostView {
  const arabic = language === "ar" ? blogTranslationsAr[post.slug] : undefined;

  if (language === "ar") {
    return {
      title: arabic?.title ?? post.title,
      subtitle: arabic?.subtitle ?? post.subtitle,
      excerpt: arabic?.excerpt ?? post.excerpt,
      readingTime: arabic?.readingTime ?? post.readingTime,
      categoryLabel: blogCategoryLabelsAr[post.category] ?? post.category,
      audienceLabels: post.audience.map(
        (audience) => blogAudienceLabelsAr[audience] ?? audience
      ),
      tagLabels: post.tags.map((tag) => blogTagLabelsAr[tag] ?? tag),
      dateLabel: formatBlogDateAr(post.date),
      sourceLabel: sourceLabels.ar[post.sourceType],
      content: arabic?.content ?? post.content
    };
  }

  return {
    title: post.title,
    subtitle: post.subtitle,
    excerpt: post.excerpt,
    readingTime: post.readingTime,
    categoryLabel: post.category,
    audienceLabels: post.audience,
    tagLabels: post.tags,
    dateLabel: formatBlogDate(post.date),
    sourceLabel: sourceLabels.en[post.sourceType],
    content: post.content
  };
}

export const globalPulseItemsAr: GlobalPulseItem[] = [
  {
    title: "الـ AI Agents صاروا واجهات منتجات",
    summary:
      "التحول المهم مو نافذة محادثة جديدة، بل الانتقال نحو تجارب AI تقدر تسترجع السياق وتستخدم أدوات معتمدة وتقود المستخدم خلال خطوات عمل حقيقية.",
    category: "الـ AI Agents"
  },
  {
    title: "الـ AI المحلي والخصوصية صارا أولوية استراتيجية",
    summary:
      "المؤسسات صارت تدقق أكثر في وين تسافر بياناتها، وأي مصادر معرفة يستخدمها نظام الـ AI، وكم تحتفظ من السيطرة على المسارات الحساسة.",
    category: "AI يحترم الخصوصية"
  },
  {
    title: "تقييم الـ AI صار بأهمية توليده",
    summary:
      "الفرق صارت تتجاوز الانبهار بالمخرجات نحو طرق قابلة للتكرار لقياس الموثوقية والفائدة والأمان وأنماط الفشل قبل وصول الـ AI للمستخدمين.",
    category: "بناء منتجات الـ AI"
  }
];

export const blogText = {
  en: {
    heroEyebrow: "Writing",
    heroTitle: "Notes",
    heroSubtitle:
      "Practical ideas about AI agents, LLMs, cloud AI, privacy-first systems, and applied AI for students, builders, and decision-makers.",
    statArticlesLabel: "Original articles",
    statTopicsLabel: "AI topic areas",
    statCuratedValue: "Curated",
    statCuratedLabel: "Credible insights, clearly sourced",
    statGlobalValue: "Global",
    statGlobalLabel: "Useful across backgrounds and specialties",
    startHere: "Start here",
    libraryBadge: "Knowledge library",
    libraryTitle: "Explore practical AI ideas",
    libraryBody:
      "Search by topic or choose the audience closest to your goals. Each article is written to be useful without flattening the technical details that matter.",
    searchLabel: "Search AI insights",
    searchPlaceholder: "Search AI topics, agents, cloud, privacy, education...",
    exploreByTopic: "Explore by topic",
    usefulFor: "Useful for",
    categoryFiltersLabel: "Blog category filters",
    audienceFiltersLabel: "Blog audience filters",
    emptyState: "No article matches those filters yet. Try a broader topic or audience.",
    readArticle: "Read article",
    forLabel: "For:",
    featuredBadge: "Featured article",
    readFeatured: "Read featured article",
    writtenFor: "Written for",
    pulseBadge: "Curated insight, not live news",
    pulseTitle: "Global AI Pulse",
    pulseBody:
      "Curated signals and ideas from the global AI landscape. This section is designed to help readers follow what matters without drowning in hype.",
    curatedSignal: "Curated signal",
    ctaTitle: "Want to explore my applied AI work?",
    ctaBody:
      "Continue from practical ideas into project case studies, ask Agent Abdulelah about a topic, or download a role-focused resume.",
    viewProjects: "View Projects",
    askAgent: "Ask Agent Abdulelah",
    downloadResume: "Download Resume",
    ctaPrompt: "What should I read first?",
    backToBlog: "Back to Notes",
    forAudiences: "For",
    externalSource: "External source:",
    continueBadge: "Continue exploring",
    continueTitle: "Ask a question or view applied work",
    continueBody:
      "Use Agent Abdulelah to explore this topic in context, or move into project case studies that show applied AI thinking.",
    askAboutTopic: "Ask Agent Abdulelah about this topic",
    viewRelatedProjects: "View related projects",
    relatedBadge: "Related posts",
    relatedTitle: "Keep building your AI perspective",
    relatedBody: "Move across fundamentals, product thinking, and applied examples.",
    browseAll: "Browse all insights",
    keyTakeaway: "Key takeaway",
    articlePrompt: (title: string) =>
      `Explain the "${title}" article and how it relates to Abdulelah's portfolio.`
  },
  ar: {
    heroEyebrow: "كتابات",
    heroTitle: "ملاحظات",
    heroSubtitle:
      "أفكار عملية عن الـ AI Agents والـ LLMs والـ Cloud AI والأنظمة اللي تحترم الخصوصية، وتطبيقات واقعية للذكاء الاصطناعي — للطلاب والبنّائين وصنّاع القرار.",
    statArticlesLabel: "مقالات أصلية",
    statTopicsLabel: "مجالات في الـ AI",
    statCuratedValue: "منتقى",
    statCuratedLabel: "محتوى موثوق وواضح المصدر",
    statGlobalValue: "عالمي",
    statGlobalLabel: "مفيد لمختلف الخلفيات والتخصصات",
    startHere: "ابدأ من هنا",
    libraryBadge: "مكتبة المعرفة",
    libraryTitle: "استكشف أفكار AI عملية",
    libraryBody:
      "ابحث حسب الموضوع أو اختر الجمهور الأقرب لهدفك. كل مقال مكتوب ليفيدك بدون ما يضحّي بالتفاصيل التقنية المهمة.",
    searchLabel: "ابحث في مقالات الـ AI",
    searchPlaceholder: "ابحث في مواضيع الـ AI: الوكلاء، السحابة، الخصوصية، التعليم...",
    exploreByTopic: "تصفح حسب الموضوع",
    usefulFor: "مفيد لـ",
    categoryFiltersLabel: "فلاتر مواضيع المدونة",
    audienceFiltersLabel: "فلاتر جمهور المدونة",
    emptyState: "ما فيه مقال يطابق هذه الفلاتر حاليًا. جرّب موضوع أو جمهور أوسع.",
    readArticle: "اقرأ المقال",
    forLabel: "لمن:",
    featuredBadge: "مقال مميز",
    readFeatured: "اقرأ المقال المميز",
    writtenFor: "كُتب لـ",
    pulseBadge: "محتوى منتقى، مو أخبار لحظية",
    pulseTitle: "نبض الـ AI العالمي",
    pulseBody:
      "إشارات وأفكار منتقاة من مشهد الـ AI العالمي. هذا القسم مصمم يساعدك تتابع المهم بدون ما تغرق في الضجة.",
    curatedSignal: "إشارة منتقاة",
    ctaTitle: "تبي تستكشف شغلي التطبيقي في الـ AI؟",
    ctaBody:
      "انتقل من الأفكار العملية إلى دراسات حالة المشاريع، أو اسأل Agent Abdulelah عن موضوع، أو حمّل سيرة ذاتية مخصصة حسب الدور.",
    viewProjects: "استعرض المشاريع",
    askAgent: "اسأل Agent Abdulelah",
    downloadResume: "حمّل السيرة الذاتية",
    ctaPrompt: "وش تنصحني أقرأ أول شيء في مدونة عبدالإله؟",
    backToBlog: "الرجوع إلى الملاحظات",
    forAudiences: "لـ",
    externalSource: "المصدر الخارجي:",
    continueBadge: "تابع الاستكشاف",
    continueTitle: "اسأل سؤال أو شف الشغل التطبيقي",
    continueBody:
      "استخدم Agent Abdulelah لاستكشاف هذا الموضوع بسياقه، أو انتقل لدراسات حالة المشاريع اللي توضح التفكير التطبيقي في الـ AI.",
    askAboutTopic: "اسأل Agent Abdulelah عن هذا الموضوع",
    viewRelatedProjects: "شف المشاريع المرتبطة",
    relatedBadge: "مقالات مرتبطة",
    relatedTitle: "واصل بناء منظورك في الـ AI",
    relatedBody: "تنقّل بين الأساسيات وتفكير المنتجات والأمثلة التطبيقية.",
    browseAll: "تصفح كل المقالات",
    keyTakeaway: "الخلاصة",
    articlePrompt: (title: string) =>
      `اشرح لي مقال "${title}" وكيف يرتبط بأعمال عبدالإله.`
  }
} as const;

export function getBlogText(language: BlogLanguage) {
  return blogText[language];
}
