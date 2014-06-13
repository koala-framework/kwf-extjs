// @require qunit
QUnit.asyncTest( "Test Lazy Load", function( assert ) {
  expect( 2 );


    Kwf.Loader.require('Ext4.panel.Panel', function() {
        Kwf.Loader.require('Ext4.grid.Panel', function() {
            Kwf.Loader.require('Ext4.tree.Panel', function() {
            });
            Kwf.Loader.require('Ext4.window.Window', function() {
                var w = new Ext4.window.Window({
                    title: 'windowtitle',
                    html: 'windowcontent 123 123 123'
                });
                w.show();
            });
        });
    });
    Kwf.Loader.require('Ext4.panel.Panel', function() {
    });

    var tries = 0;
    var fn = function() {
        tries++;
        if (tries > 100) {
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
