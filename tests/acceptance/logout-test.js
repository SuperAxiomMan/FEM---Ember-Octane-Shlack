import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import MockAuthService from '../stubs/auth-service';

module('Acceptance | loggin out', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:auth', MockAuthService);
  });

  test('visiting /teams and clicking logout button', async function (assert) {
    this.owner.lookup('service:auth').currentUserId = '1';
    await visit('/teams/linkedin'); // go to the teams URL
    assert.ok(currentURL().startsWith('/teams'));

    await click('.team-sidebar__logout-button'); //click the logout button
    assert.equal(currentURL(), '/login');
  });
});
