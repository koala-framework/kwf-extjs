// @require qunit
// @require Ext4.window.Window

QUnit.test( "Test Window", function( assert ) {
    var w = new Ext4.window.Window({
        title: 'windowtitle',
        html: 'windowcontent 123 123 123'
    });
    w.show();
    assert.ok(document.body.innerHTML.match(/windowtitle/), "Window Title exists");
    assert.ok(document.body.innerHTML.match(/windowcontent/), "Window Content exists");
});
