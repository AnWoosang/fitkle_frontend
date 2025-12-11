export interface NewsPost {
  id: string;
  titleKo: string;
  titleEn: string;
  titleZh: string;
  titleVi: string;
  contentKo: string;
  contentEn: string;
  contentZh: string;
  contentVi: string;
  date: string;
  author: string;
  category: 'announcement' | 'update' | 'story' | 'community';
  isPinned?: boolean;
  image?: string;
  tags?: string[];
  readTime?: string;
}

export const newsPosts: NewsPost[] = [
  {
    id: '1',
    titleKo: '핏클을 소개합니다 💚',
    titleEn: 'Introducing fitkle 💚',
    titleZh: '介绍 fitkle 💚',
    titleVi: 'Giới thiệu fitkle 💚',
    contentKo: `안녕하세요, 핏클 팀입니다!

우리는 한국에 거주하는 외국인 친구들과 함께 살아가는 것을 사랑하는 사람들입니다. 다양한 문화를 존중하고, 서로 다른 배경을 가진 사람들이 만나 새로운 우정을 쌓는 것이 얼마나 소중한지 잘 알고 있습니다.

핏클은 외국인 친구들에게서 직접 들은 이야기에서 시작되었습니다. "한국에서 친구를 사귀기가 너무 어려워요", "내 관심사를 공유할 사람을 찾기 힘들어요", "언어 장벽 때문에 힘들어요" - 이런 이야기들을 들으면서, 우리는 무언가를 해야겠다고 생각했습니다.

💡 **우리의 미션**
한국에 거주하는 외국인들이 겪는 어려움을 이해하고, 그들이 한국 생활에 더 잘 적응하고 즐거운 시간을 보낼 수 있도록 돕는 것입니다.

🌏 **우리가 믿는 것**
- 다양한 문화는 우리를 더 풍요롭게 만듭니다
- 진정한 연결은 언어를 넘어섭니다
- 작은 모임이 큰 변화를 만들 수 있습니다

📢 **여러분의 목소리를 들려주세요**
핏클은 여러분과 함께 만들어가는 커뮤니티입니다. 한국 생활에서 어려운 점, 필요한 정보, 바라는 점들을 자유롭게 공유해주세요. 여러분의 피드백은 우리가 더 나은 서비스를 만드는 데 큰 도움이 됩니다.

함께 따뜻하고 포용적인 커뮤니티를 만들어가요! 🌈`,
    contentEn: `Hello, this is the fitkle team!

We are people who love living alongside our international friends in Korea. We deeply understand how precious it is to respect diverse cultures and build new friendships with people from different backgrounds.

fitkle started from stories we heard directly from our international friends. "It's so hard to make friends in Korea," "I can't find people who share my interests," "The language barrier is tough" - hearing these stories made us realize we needed to do something.

💡 **Our Mission**
To understand the challenges faced by foreigners living in Korea and help them adapt better to Korean life and have a great time.

🌏 **What We Believe**
- Diverse cultures make us richer
- True connections transcend language
- Small meetups can create big changes

📢 **Share Your Voice**
fitkle is a community built together with you. Please freely share the difficulties you face in Korean life, information you need, and what you hope for. Your feedback is invaluable in helping us create a better service.

Let's build a warm and inclusive community together! 🌈`,
    contentZh: `你好，这里是 fitkle 团队！

我们热爱与在韩国居住的外国朋友们一起生活。我们深知尊重多元文化、与不同背景的人建立新友谊是多么珍贵。

fitkle 源于我们直接从外国朋友那里听到的故事。"在韩国交朋友太难了"，"我找不到志同道合的人"，"语言障碍让我很困扰" - 听到这些故事后，我们意识到必须做点什么。

💡 **我们的使命**
理解在韩外国人面临的挑战，帮助他们更好地适应韩国生活，度过愉快时光。

🌏 **我们的信念**
- 多元文化让我们更加丰富
- 真正的联系超越语言
- 小型聚会可以创造大变化

📢 **分享您的声音**
fitkle 是与您共同建立的社区。请自由分享您在韩国生活中遇到的困难、需要的信息以及期望。您的反馈对我们创造更好的服务非常宝贵。

让我们一起建立一个温暖包容的社区！🌈`,
    contentVi: `Xin chào, đây là đội ngũ fitkle!

Chúng tôi là những người yêu thích việc sống cùng các bạn quốc tế tại Hàn Quốc. Chúng tôi hiểu rõ việc tôn trọng các nền văn hóa đa dạng và xây dựng tình bạn mới với những người có xuất thân khác nhau quý giá như thế nào.

fitkle bắt đầu từ những câu chuyện chúng tôi nghe trực tiếp từ bạn bè quốc tế. "Kết bạn ở Hàn Quốc thật khó," "Tôi không thể tìm thấy người cùng sở thích," "Rào cản ngôn ngữ thật khó khăn" - nghe những câu chuyện này khiến chúng tôi nhận ra cần phải làm gì đó.

💡 **Sứ Mệnh Của Chúng Tôi**
Hiểu những thách thức mà người nước ngoài sống tại Hàn Quốc phải đối mặt và giúp họ thích nghi tốt hơn với cuộc sống Hàn Quốc và có khoảng thời gian tuyệt vời.

🌏 **Những Gì Chúng Tôi Tin Tưởng**
- Văn hóa đa dạng làm chúng ta phong phú hơn
- Kết nối thực sự vượt qua ngôn ngữ
- Các buổi gặp mặt nhỏ có thể tạo ra thay đổi lớn

📢 **Chia Sẻ Tiếng Nói Của Bạn**
fitkle là cộng đồng được xây dựng cùng với bạn. Hãy tự do chia sẻ những khó khăn bạn gặp phải trong cuộc sống Hàn Quốc, thông tin bạn cần và những gì bạn mong muốn. Phản hồi của bạn vô cùng quý giá giúp chúng tôi tạo ra dịch vụ tốt hơn.

Hãy cùng nhau xây dựng một cộng đồng ấm áp và hòa nhập! 🌈`,
    date: '2025-01-15',
    author: 'fitkle Team',
    category: 'announcement',
    isPinned: true,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwbWVldGluZyUyMGZyaWVuZHN8ZW58MXx8fHwxNzYwNTMxMzE1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['announcement', 'community', 'welcome'],
    readTime: '3 min read',
  },
];

// Legacy export for backward compatibility
export const news = newsPosts;
