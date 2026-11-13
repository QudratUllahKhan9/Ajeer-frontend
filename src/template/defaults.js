/**
 * Default record = the exact values of the source PDF
 * (TQ5491374 — MUHAMMAD KASHIF KHAN ZAMAN).
 * Every key here is also an editable field in the React form.
 *
 * inkColor  : #000000 — the PDF's measured text colour (all 13 text spans).
 * headerFrame: false — no box on top; set true to get the PDF's 0.72pt boxes.
 */
export const defaultPermit = {
  permitNo: 'TQ5491374',
  qrHint: 'اضغط للتحقق',
  title: 'تصريح أجير – تعاقد أجير',

  // بيانات العامل
  workerName: 'MUHAMMAD KASHIF KHAN\nZAMAN',
  profession: 'عامل بناء',
  idNumber: '2562349304',
  nationality: 'باكستان',

  // بيانات مقدم الخدمة
  providerCompany: 'شركة عبدالله بن حمود الحربي\nللتجارة',
  providerCr: '17-8463219',

  // بيانات المستفيدة من الخدمة
  beneficiaryCompany: 'شركه فال السعوديه',
  beneficiaryCr: '14-1945799',

  // بيانات التصريح
  contractNote: 'Providing services according to purchase orders 104101',
  startDate: '2026-10-29',
  endDate: '2027-01-28',
  workSites: 'المتنبي, حي النور، النور، 82844 ,السعودية GGSC4981,4981',

  // presentation
  inkColor: '#000000',
  headerFrame: false
}

/**
 * Fixed legal copy. Each entry's lines are the PDF's own line breaks
 * (measured ink extents per line), so the render breaks exactly like the
 * original instead of re-wrapping.
 */
export const staticText = {
  intro: [
    'نشعركم أنه تم التعاقد من قبلنا كجهة مقدمة للخدمة مع الجهة المستفيدة من الخدمة حسب المعلومات المبينة أدناه، وذلك تم تسجيل',
    'معلومات العقد لتكون بحوزة العامل لإثبات عدم مخالفته لنظام العمل ولتقديمها إلى من يهمه الأمر من الجهات المختصة عند طلبها',
    'للتحقق من صحة تواجده في مكان تقديم الخدمة'
  ],
  sections: {
    worker: 'بيانات العامل',
    provider: 'بيانات مقدم الخدمة',
    beneficiary: 'بيانات المستفيد من الخدمة',
    permit: 'بيانات التصريح'
  },
  labels: {
    workerName: 'اسم العامل',
    profession: 'المهنة',
    idNumber: 'رقم الهوية / الإقامة',
    nationality: 'الجنسية',
    providerCompany: 'المنشأة المقدمة للخدمة',
    providerCr: 'رقم المنشأة في وزارة الموارد البشرية و التنمية الاجتماعية',
    beneficiaryCompany: 'المنشأة المستفيدة من الخدمة',
    beneficiaryCr: 'رقم المنشأة في وزارة الموارد البشرية و التنمية الاجتماعية',
    contractNote: 'نبذة عن التعاقد',
    startDate: 'تاريخ بداية التصريح',
    endDate: 'تاريخ نهاية التصريح',
    workSites: 'مواقع العمل'
  },
  declTitle: 'إقرارات',
  declIntro: 'أقر أنا المنشأة المقدمة للخدمة والموضحة بياناتي أعلاه وأتعهد بـ:',
  declItems: [
    [
      'إن العامل حامل هذا التصريح يحمله له يقر ويتعهد بأن البيانات المدونة فيه صحيحة على مسئوليته الشخصية، وأنه يعمل لدى المنشأة',
      'ولحسابها، بموجب رخصة إقامة سارية المفعول. وأتحمل أي تبعات قانونية أو غرامات تترتب على خلاف المذكور أعلاه.'
    ],
    ['الالتزام والتقييد بأنظمة العمل والعمال وأي أنظمة و لوائح وقرارات أخرى ذات علاقة.'],
    [
      'أن الموقع الإلكتروني الخاص بأجير أو القائمين عليه عبارة عن وسيط إلكتروني ما بين الباحثين عن العمل وأصحاب الأعمال فقط وبدون',
      'أي التزام قانوني أو غيره على القائمين على موقع أجير.'
    ],
    ['أي تعديل أو كشف في هذا التصريح يجعله لاغياً.']
  ],
  footer1: 'للتحقق من صحة هذا التصريح وسريان مفعوله بإمكانك زيارة موقع أجير (https://ajeer.com.sa)',
  footer2: '* خدمة معتمدة من وزارة الموارد البشرية والتنمية الاجتماعية'
}
