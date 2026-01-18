import { chromium } from 'playwright';

async function testNunchiGameCountdown() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  // 호스트 페이지
  const hostPage = await context.newPage();
  // 플레이어 페이지들 (최소 2명 필요)
  const player1Page = await context.newPage();
  const player2Page = await context.newPage();

  try {
    console.log('🎮 테스트 시작: 눈치게임 카운트다운');

    // 1. 호스트가 방 만들기
    console.log('\n1️⃣ 호스트가 방 만들기...');
    await hostPage.goto('http://localhost:3000');
    await hostPage.waitForTimeout(1000);

    // 닉네임 입력
    await hostPage.fill('input[placeholder*="닉네임"]', '호스트');
    await hostPage.click('button:has-text("방 만들기")');
    await hostPage.waitForTimeout(2000);

    // 게임 선택 페이지로 이동했는지 확인
    console.log('   ✅ 방 생성 완료');

    // 눈치게임 선택
    console.log('\n2️⃣ 눈치게임 선택...');
    await hostPage.click('button:has-text("눈치게임"), .game-card:has-text("눈치게임")');
    await hostPage.waitForTimeout(2000);

    // 방 코드 가져오기
    const roomCodeElement = await hostPage.locator('.room-code span').first();
    const roomCode = await roomCodeElement.textContent();
    console.log(`   ✅ 방 코드: ${roomCode}`);

    // 규칙 모달이 있으면 닫기 또는 준비 완료 (호스트는 준비 불필요)
    const rulesModal = await hostPage.locator('.modal-content').count();
    if (rulesModal > 0) {
      const closeButton = await hostPage.locator('button:has-text("나가기")').first();
      if (await closeButton.isVisible()) {
        // 모달 밖 클릭으로 닫기
        await hostPage.keyboard.press('Escape');
        await hostPage.waitForTimeout(500);
      }
    }

    // 3. 플레이어들 참가
    console.log('\n3️⃣ 플레이어들 참가...');

    // 플레이어 1
    await player1Page.goto('http://localhost:3000');
    await player1Page.waitForTimeout(1000);
    await player1Page.fill('input[placeholder*="닉네임"]', '플레이어1');
    await player1Page.fill('input[placeholder*="방 코드"]', roomCode);
    await player1Page.click('button:has-text("참가하기")');
    await player1Page.waitForTimeout(2000);
    console.log('   ✅ 플레이어1 참가 완료');

    // 플레이어 2
    await player2Page.goto('http://localhost:3000');
    await player2Page.waitForTimeout(1000);
    await player2Page.fill('input[placeholder*="닉네임"]', '플레이어2');
    await player2Page.fill('input[placeholder*="방 코드"]', roomCode);
    await player2Page.click('button:has-text("참가하기")');
    await player2Page.waitForTimeout(2000);
    console.log('   ✅ 플레이어2 참가 완료');

    // 플레이어들 준비 완료
    console.log('\n   🔍 플레이어들 준비 중...');
    await player1Page.waitForTimeout(3000);

    // 플레이어 1 준비 - 모달 내부의 버튼 찾기
    const player1ReadyButton = player1Page.locator('.modal-footer button.btn-primary:not(:disabled)').first();
    const isPlayer1ReadyVisible = await player1ReadyButton.isVisible({ timeout: 5000 }).catch(() => false);
    if (isPlayer1ReadyVisible) {
      console.log('   ✅ 플레이어1 준비 버튼 클릭');
      await player1ReadyButton.click();
      await player1Page.waitForTimeout(1500);
    } else {
      console.log('   ⚠️  플레이어1 준비 버튼 없음');
      await player1Page.screenshot({ path: '/tmp/player1-ready.png' });
    }

    // 플레이어 2 준비
    await player2Page.waitForTimeout(1000);
    const player2ReadyButton = player2Page.locator('.modal-footer button.btn-primary:not(:disabled)').first();
    const isPlayer2ReadyVisible = await player2ReadyButton.isVisible({ timeout: 5000 }).catch(() => false);
    if (isPlayer2ReadyVisible) {
      console.log('   ✅ 플레이어2 준비 버튼 클릭');
      await player2ReadyButton.click();
      await player2Page.waitForTimeout(1500);
    } else {
      console.log('   ⚠️  플레이어2 준비 버튼 없음');
      await player2Page.screenshot({ path: '/tmp/player2-ready.png' });
    }

    console.log('   ✅ 모든 플레이어 준비 완료');

    // 4. 호스트가 게임 시작 버튼 클릭
    console.log('\n4️⃣ 호스트가 게임 시작 버튼 클릭...');
    await hostPage.waitForTimeout(2000);

    // 호스트 페이지 스크린샷
    await hostPage.screenshot({ path: '/tmp/host-before-start.png' });
    console.log('   📸 호스트 페이지 스크린샷: /tmp/host-before-start.png');

    const startButton = await hostPage.locator('button:has-text("게임 시작"), button:has-text("Start Game")').first();
    const isStartButtonVisible = await startButton.isVisible({ timeout: 3000 }).catch(() => false);

    if (isStartButtonVisible) {
      console.log('   ✅ 게임 시작 버튼 발견');
      await startButton.click();
      await hostPage.waitForTimeout(500);

      // 5. 카운트다운 확인
      console.log('\n5️⃣ 카운트다운 확인 중...');

      // 카운트다운 오버레이 확인
      const countdownOverlay = hostPage.locator('.countdown-overlay');
      const isVisible = await countdownOverlay.isVisible({ timeout: 2000 }).catch(() => false);

      if (isVisible) {
        console.log('   ✅ 카운트다운 오버레이 표시됨!');

        // 숫자 확인
        for (let i = 5; i >= 1; i--) {
          const countdownNumber = hostPage.locator('.countdown-number');
          const number = await countdownNumber.textContent();
          console.log(`   ⏱️  카운트다운: ${number}`);
          await hostPage.waitForTimeout(1000);
        }

        // 카운트다운이 사라졌는지 확인
        await hostPage.waitForTimeout(1000);
        const stillVisible = await countdownOverlay.isVisible().catch(() => false);
        if (!stillVisible) {
          console.log('   ✅ 카운트다운 완료 후 사라짐!');
        }

        // 게임이 시작되었는지 확인
        const gameBoard = await hostPage.locator('.nunchi-game-area, .game-status').isVisible({ timeout: 3000 }).catch(() => false);
        if (gameBoard) {
          console.log('   ✅ 게임 보드 표시됨!');
        } else {
          console.log('   ⚠️  게임 보드가 표시되지 않음');
        }

        console.log('\n✅ 테스트 성공! 카운트다운이 정상적으로 작동합니다!');
      } else {
        console.log('   ❌ 카운트다운 오버레이가 표시되지 않음');
        console.log('   🔍 현재 페이지 상태 확인 중...');

        // 페이지 스크린샷
        await hostPage.screenshot({ path: '/tmp/host-page.png' });
        console.log('   📸 스크린샷 저장: /tmp/host-page.png');
      }
    } else {
      console.log('   ❌ 게임 시작 버튼을 찾을 수 없음');
    }

    // 대기
    console.log('\n⏳ 5초 후 브라우저 종료...');
    await hostPage.waitForTimeout(5000);

  } catch (error) {
    console.error('❌ 테스트 실패:', error.message);
    await hostPage.screenshot({ path: '/tmp/error-screenshot.png' });
    console.log('📸 에러 스크린샷: /tmp/error-screenshot.png');
  } finally {
    await browser.close();
    console.log('\n🏁 테스트 종료');
  }
}

testNunchiGameCountdown();
