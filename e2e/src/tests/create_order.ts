import 'testcafe';
import {TokenAuthorization} from "../lib/TokenAuthorization";
import {TestEnvApi} from "../lib/TestEnvApi";
import TodaysOrderView from "../pageObjects/TodaysOrderView";

const TARGET_PORT = process.env.TARGET_PORT;

const tokenAuthorization = new TokenAuthorization();
const testEnvApi = new TestEnvApi()


fixture(`Create order`)
  .before( async _ => {
    await tokenAuthorization.init()
  })
  .beforeEach(async t => {
    await testEnvApi.generateRestaurantsAndDishes()
    await t.resizeWindow(1400, 700)
  })
  .page `http://localhost:${TARGET_PORT}/orders`
  .requestHooks(tokenAuthorization);


test('Create order', async _ => {
  await TodaysOrderView.clickAddNewOrderButton();

  // Fill restaurant field

  // Change no details - click next


});
