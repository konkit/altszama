import 'testcafe';
import {TokenAuthorization} from "../lib/TokenAuthorization";
import {Selector} from "testcafe";

const tokenAuthorization = new TokenAuthorization();

fixture(`Feature: my new feature`)
  .before( async _ => {
    await tokenAuthorization.init()
  })
  .page `http://localhost:8080/orders`
  .requestHooks(tokenAuthorization);

test('Scenario: my new scenario', async t => {
  await t.resizeWindow(1400, 700)
  await t.expect(Selector("body").innerText).contains("You haven't ordered anything today yet.")
  await t.click(Selector("button").withText("ADD NEW ORDER"))
  await t.debug()
});
