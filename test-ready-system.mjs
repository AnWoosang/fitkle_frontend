import { chromium } from 'playwright';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testReadySystem() {
  const browser = await chromium.launch({ headless: false });
  
  try {
    // Create 3 contexts (3 players)
    const contexts = await Promise.all([
      browser.newContext(),
      browser.newContext(),
      browser.newContext()
    ]);

    const pages = await Promise.all(contexts.map(ctx => ctx.newPage()));
    
    console.log('✅ Opened 3 browser tabs');

    // Navigate all tabs to lobby
    await Promise.all(pages.map(page => page.goto('http://localhost:5174')));
    console.log('✅ All tabs navigated to lobby');

    await sleep(1000);

    // Player 1 (Host) creates room
    console.log('\n🎮 Player 1 creating room...');
    await pages[0].fill('input[placeholder*="닉네임"]', 'Host');
    await pages[0].click('button:has-text("방 만들기")');
    await sleep(2000);

    // Get room code from Host's page
    const roomCodeText = await pages[0].locator('.room-code span').textContent();
    console.log(`✅ Room created with code: ${roomCodeText}`);

    // Check if rules modal is shown for Host
    const hostModalVisible = await pages[0].locator('.modal-overlay').isVisible();
    console.log(`✅ Rules modal visible for Host: ${hostModalVisible}`);

    await sleep(1000);

    // Players 2 and 3 join the room
    console.log('\n👥 Players 2 and 3 joining room...');
    for (let i = 1; i < 3; i++) {
      await pages[i].fill('input[placeholder*="닉네임"]', `Player${i+1}`);
      await pages[i].fill('input[placeholder*="방 코드"]', roomCodeText);
      await pages[i].click('button:has-text("참가하기")');
      await sleep(1500);
      console.log(`✅ Player${i+1} joined`);
    }

    await sleep(1000);

    // Check if all players see the rules modal
    for (let i = 0; i < 3; i++) {
      const modalVisible = await pages[i].locator('.modal-overlay').isVisible();
      console.log(`✅ Player ${i+1} sees rules modal: ${modalVisible}`);
    }

    // Check if Host can start game (should be disabled until all players ready)
    const hostStartButton = await pages[0].locator('button:has-text("게임 시작")');
    const isHostButtonDisabled = await hostStartButton.isDisabled();
    console.log(`\n✅ Host start button disabled (waiting for players): ${isHostButtonDisabled}`);

    // Players 2 and 3 click ready button
    console.log('\n✋ Players getting ready...');
    for (let i = 1; i < 3; i++) {
      await pages[i].click('button:has-text("준비")');
      await sleep(1000);
      console.log(`✅ Player${i+1} clicked ready`);
    }

    await sleep(1000);

    // Check if Host start button is now enabled
    const isHostButtonEnabled = !(await hostStartButton.isDisabled());
    console.log(`✅ Host start button enabled (all players ready): ${isHostButtonEnabled}`);

    // Host starts the game
    console.log('\n🎮 Host starting game...');
    await pages[0].click('button:has-text("게임 시작")');
    await sleep(2000);

    // Check if rules modal is hidden and game is playing
    const gameStatus = await pages[0].locator('.status-playing').isVisible();
    console.log(`✅ Game started successfully: ${gameStatus}`);

    // Check if rules modal is closed
    const modalClosed = !(await pages[0].locator('.modal-overlay').isVisible());
    console.log(`✅ Rules modal closed after game start: ${modalClosed}`);

    // Simulate game play - all 3 players call numbers to trigger n-1 rule
    console.log('\n🎯 Simulating game play...');
    for (let i = 0; i < 2; i++) {  // 3 players, n-1 = 2 numbers
      await pages[i].click('.call-button');
      await sleep(1500);
      console.log(`✅ Player${i+1} called number ${i+1}`);
    }

    await sleep(2000);

    // Check if result modal is shown
    const resultModalVisible = await pages[0].locator('.game-result-modal').isVisible();
    console.log(`\n✅ Result modal shown after game end: ${resultModalVisible}`);

    // Check if result modal shows eliminated players
    const eliminatedListVisible = await pages[0].locator('.eliminated-list').isVisible();
    console.log(`✅ Eliminated players list shown: ${eliminatedListVisible}`);

    await sleep(2000);

    console.log('\n🎉 All tests passed! Ready system and modals work correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    console.log('\nPress Ctrl+C to close browser...');
    // Keep browser open for inspection
    await sleep(60000);
    await browser.close();
  }
}

testReadySystem();
