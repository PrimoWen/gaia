'use strict';

suite('L10n bootstrap', function() {
  suite('buildLocaleList', function() {
    var buildLocaleList,
        defaultLocale,
        realGaiaVersion;

    suiteSetup(function() {
      var L10n = navigator.mozL10n._getInternalAPI();
      defaultLocale = navigator.mozL10n.ctx.defaultLocale;
      buildLocaleList = L10n.buildLocaleList.bind(navigator.mozL10n);
      realGaiaVersion = navigator.mozL10n._config.gaiaVersion;
      navigator.mozL10n._config.gaiaVersion = '2.2';
    });

    suiteTeardown(function() {
      navigator.mozL10n._config.gaiaVersion = realGaiaVersion;
      realGaiaVersion = undefined;
      defaultLocale = undefined;
      buildLocaleList = undefined;
    });

    test('no meta, no extra', function() {
      var meta = {};
      var res = buildLocaleList(meta);

      assert.equal(res[0], defaultLocale);
      var obj = {};
      obj[defaultLocale] = 'app';
      assert.deepEqual(res[1], obj);
    });

    test('meta with just defaultLocale, no extra', function() {
      var meta = {defaultLocale: 'ab-CD'};
      var res = buildLocaleList(meta);

      assert.equal(res[0], 'ab-CD');
      assert.deepEqual(res[1], {'ab-CD': 'app'});
    });

    test('full meta, simple availableLanguages, no extra', function() {
      var meta = {
        defaultLocale: 'ab-CD',
        availableLanguages: {'lang1': undefined}
      };
      var res = buildLocaleList(meta);

      assert.equal(res[0], 'ab-CD');
      assert.deepEqual(res[1], {'ab-CD': 'app', 'lang1': 'app'});
    });

    test('full meta, no extra', function() {
      var meta = {
        defaultLocale: 'ab-CD',
        availableLanguages: {'lang1': '201501151000'}
      };
      var res = buildLocaleList(meta);

      assert.equal(res[0], 'ab-CD');
      assert.deepEqual(res[1], {'ab-CD': 'app', 'lang1': 'app'});
    });

    test('full meta, extra, matching target', function() {
      var meta = {
        defaultLocale: 'ab-CD',
        availableLanguages: {'lang1': '201501151000'}
      };
      var extraLangs = {
        'lang2': [
          {'version': '201501151213', 'target': '2.2'}
        ]
      };
      var res = buildLocaleList(meta, extraLangs);

      assert.equal(res[0], 'ab-CD');
      assert.deepEqual(res[1], {
        'ab-CD': 'app',
        'lang1': 'app',
        'lang2': 'extra'
      });
    });

    test('full meta, extra, target not matching', function() {
      var meta = {
        defaultLocale: 'ab-CD',
        availableLanguages: {'lang1': '201501151000'}
      };
      var extraLangs = {
        'lang2': [
          {'version': '201501151213', 'target': '2.3'}
        ]
      };
      var res = buildLocaleList(meta, extraLangs);

      assert.equal(res[0], 'ab-CD');
      assert.deepEqual(res[1], {'ab-CD': 'app', 'lang1': 'app'});
    });

    test('full meta, extra, updated locale', function() {
      var meta = {
        defaultLocale: 'ab-CD',
        availableLanguages: {'lang1': '201501151000'}
      };
      var extraLangs = {
        'lang1': [
          {'version': '201501151213', 'target': '2.2'}
        ]
      };
      var res = buildLocaleList(meta, extraLangs);

      assert.equal(res[0], 'ab-CD');
      assert.deepEqual(res[1], {'ab-CD': 'app', 'lang1': 'extra'});
    });

    test('full meta, extra, updated locale obsolete', function() {
      var meta = {
        defaultLocale: 'ab-CD',
        availableLanguages: {'lang1': '201501161000'}
      };
      var extraLangs = {
        'lang1': [
          {'version': '201501151213', 'target': '2.2'}
        ]
      };
      var res = buildLocaleList(meta, extraLangs);

      assert.equal(res[0], 'ab-CD');
      assert.deepEqual(res[1], {'ab-CD': 'app', 'lang1': 'app'});
    });
  });
});
