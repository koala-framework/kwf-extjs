// @require qunit
QUnit.asyncTest( "Test Lazy Load", function( assert ) {
  expect( 2 );


    Kwf.Loader.require('Ext.panel.Panel', function() {
        Kwf.Loader.require('Ext.grid.Panel', function() {
            Kwf.Loader.require('Ext.tree.Panel', function() {
            });
            Kwf.Loader.require('Ext.window.Window', function() {
                var w = new Ext.window.Window({
                    title: 'windowtitle',
                    html: 'windowcontent 123 123 123'
                });
                w.show();
            });
        });
    });
    Kwf.Loader.require('Ext.panel.Panel', function() {
    });

    var tries = 0;
    var fn = function() {
        tries++;
        if (tries > 300) {
            QUnit.start();
            return;
        }
        if (document.body.innerHTML.match(/windowtitle/)) {
            assert.ok(document.body.innerHTML.match(/windowtitle/), "Window Title exists");
            assert.ok(document.body.innerHTML.match(/windowcontent/), "Window Content exists");
            QUnit.start();
        } else {
            setTimeout(fn, 100);
        }
    };
    fn();
});
