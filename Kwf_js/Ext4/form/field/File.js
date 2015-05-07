// @require Moxie
mOxie.Env.swf_url = 'bower_components/moxie/bin/flash/Moxie.min.swf';
mOxie.Env.xap_url = 'bower_components/moxie/bin/silverlight/Moxie.min.xap';

Ext4.define('Kwf.Ext4.form.field.File', {
    extend: 'Ext4.form.field.Base',
    requires: [
        'Ext.XTemplate',
        'Ext.button.Button',
        'Kwf.Ext4.model.Uploads'
    ],
    alias: 'widget.kwf.filefield',
    allowOnlyImages: false,
    fileSizeLimit: 0,
    showPreview: true,
    previewUrl: '/kwf/media/upload/preview?',
    previewWidth: 40,
    previewHeight: 40,
    showDeleteButton: true,
    cls: 'kwf-ext4-field-file',
    fileIcons: {
        'application/pdf': 'page_white_acrobat',
        'application/x-zip': 'page_white_compressed',
        'application/msexcel': 'page_white_excel',
        'application/msword': 'page_white_word',
        'application/mspowerpoint': 'page_white_powerpoint',
        'default': 'page_white'
    },
    previewTpl: ['<div class="hover-background"></div><a href="{href}" target="_blank" class="previewImage" ',
                 'style="width: {previewWidth}px; height: {previewHeight}px; display: block; background-repeat: no-repeat; background-position: center; background-image: url({preview});"></a>'],
    // also usable in infoTpl: {href}
    infoTpl: ['<div class="filedescription"><div class="filename">{filename}.{extension}</div>',
              '<div class="filesize"><tpl if="image">{image_width}x{image_height}px, </tpl>',
              '{file_size:fileSize}</div></div>'],
    emptyTpl: ['<div class="empty" style="height: {previewHeight}px; width: {previewWidth}px; text-align: center;line-height:{previewHeight}px">('+trlKwf('empty')+')</div>'],

    inputType : 'hidden',

    initComponent: function() {

        if (this.showPreview) {
            if (!(this.previewTpl instanceof Ext4.XTemplate)) {
                this.previewTpl = new Ext4.XTemplate(this.previewTpl);
            }
            this.previewTpl.compile();

            if (!(this.emptyTpl instanceof Ext4.XTemplate)) {
                this.emptyTpl = new Ext4.XTemplate(this.emptyTpl);
            }
            this.emptyTpl.compile();
        }

        if (!(this.infoTpl instanceof Ext4.XTemplate)) {
            this.infoTpl = new Ext4.XTemplate(this.infoTpl);
        }
        this.infoTpl.compile();

        this.callParent(arguments);

    },
    afterRender: function() {
        if (this.showPreview) {
            this.previewImageBox = this.bodyEl.createChild({
                cls: 'box'
            });

            this.emptyTpl.overwrite(this.previewImageBox, { //bild wird in der richtigen größe angezeigt
                previewWidth: this.previewWidth,
                previewHeight: this.previewHeight
            });
        }

        this.uploadButtonContainer = this.bodyEl.createChild({
            cls: 'uploadButton'
        });

        this.createUploadButton();
        if (this.showDeleteButton) {
            this.deleteButton = new Ext4.button.Button({
                text: trlKwf('Delete File'),
                cls: 'x4-btn-text-icon',
                icon: '/assets/silkicons/delete.png',
                renderTo: this.bodyEl.createChild({cls: 'deleteButton'}),
                scope: this,
                handler: function() {
                    this.setValue(null);
                }
            });
        }
        this.createInfoContainer();
        this.callParent(arguments);
    },

    alignHelpAndComment: function() {
        if (this.helpEl) {
            this.helpEl.anchorTo(this.deleteButton.el, 'r', [10, -8]);
        }
    },

    createInfoContainer: function() {
        this.infoContainer = this.bodyEl.createChild();
    },

    createUploadButton : function ()
    {
        this.uploadButton = new Ext4.button.Button({
            text: trlKwf('Upload File'),
            cls: 'x4 -btn-text-icon',
            icon: '/assets/silkicons/add.png',
            renderTo: this.uploadButtonContainer,
            scope: this,
            handler: function() {
            }
        });

        var accept = [];
        if (this.allowOnlyImages) {
            accept = [
                {title: trlKwf("Images"), extensions: "jpg,gif,png"}
            ];
        }
        this._fileInput = new mOxie.FileInput({
            browse_button: this.uploadButton.el.dom,
            multiple: false,
            accept: accept,
            runtime_order: "html5,flash,silverlight,html4"
        });
        this._fileInput.onchange = Ext4.bind(function() {
            var files = this._fileInput.files;
            if (!files.length) return;
            this._uploadFile(files[0]); //we don't support multiple (as we are a single file field)
        }, this);
        this._fileInput.init();



        this._fileDrop = new mOxie.FileDrop({
            drop_zone: this.bodyEl.dom,
            accept: accept
        });
        this._fileDrop.ondrop = Ext4.bind(function(e) {
            var files = e.target.files;
            if (!files.length) return;
            this._uploadFile(files[0]); //we don't support multiple (as we are a single file field)
        }, this);
        this._fileDrop.init();
    },

    _uploadFile: function(file)
    {
        var progress = Ext4.Msg.show({
            title : trlKwf('Upload'),
            msg : trlKwf('Uploading file'),
            buttons: false,
            progress:true,
            closable:false,
            minWidth: 250,
            buttons: Ext4.Msg.CANCEL,
            scope: this,
            fn: function(button) {
                xhr.abort();
            }
        });

        var xhr = new mOxie.XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.upload.onprogress = function (e) {
            progress.updateProgress(e.loaded / e.total);
        };
        xhr.onload = Ext4.bind(function(e) {
            if (xhr.status == 200) {
                var r = xhr.response;
                this.setValue(r.data.id);
                progress.hide();
            } else {
                progress.hide();
            }
        }, this);
        xhr.open('POST', Kwf.Ext4.model.Uploads.prototype.proxy.url, true);
        var formData = new mOxie.FormData();
        formData.append('file', file);
        for (var i in Ext4.Ajax.extraParams) {
            formData.append(i, Ext4.Ajax.extraParams[i]);
        }
        xhr.send(formData);
    },

    setValue: function(value)
    {
        if (value && this.rendered) {
            this.addCls('file-uploaded');
            this.uploadRow = false;
            Kwf.Ext4.model.Uploads.load(value, {
                success: function(upload) {
                    this.uploadRow = upload;
                    var icon = false;
                    var href = '/kwf/media/upload/download?uploadId='+upload.get('id')+'&hashKey='+upload.get('hash_key');
                    if (upload.get('mime_type')) {
                        if (this.showPreview) {
                            if (upload.get('mime_type').match(/(^image\/)/)) {
                                icon = this._generatePreviewUrl(this.previewUrl);
                            } else {
                                icon = this.fileIcons[upload.get('mime_type')] || this.fileIcons['default'];
                                icon = '/assets/silkicons/' + icon + '.png';
                            }
                            this.previewTpl.overwrite(this.previewImageBox, {
                                preview: icon,
                                href: href,
                                previewWidth: this.previewWidth,
                                previewHeight: this.previewHeight
                            });
                        }

                        var infoVars = Ext4.clone(upload.data);
                        infoVars.href = href;
                        this.infoContainer.addCls('info-container');
                        this.infoTpl.overwrite(this.infoContainer, infoVars);
                    } else {
/*
                        if (this.showPreview) {
                            this.emptyTpl.overwrite(this.previewImageBox, {
                                previewWidth: this.previewWidth,
                                previewHeight: this.previewHeight
                            });
                        }
*/
                        this.infoContainer.update('');
                    }
                },
                scope: this
            });
        } else if (this.rendered) {
            this.removeCls('file-uploaded');
            this.uploadRow = false;
            this.infoContainer.update('');
            if (this.showPreview) {
                this.emptyTpl.overwrite(this.previewImageBox, {
                    previewWidth: this.previewWidth,
                    previewHeight: this.previewHeight
                });
            }
        }

        this.callParent(arguments);
    },

    _generatePreviewUrl: function (previewUrl) {
        return previewUrl+'uploadId='+this.uploadRow.get('id')
        +'&hashKey='+this.uploadRow.get('hash_key');
    },

    setPreviewUrl: function (previewUrl) {
        this.previewUrl = previewUrl;
        if (!previewUrl) {
            this.getEl().child('.box').setStyle('background-image', 'none');
            return;
        }
        if (this.getEl().child('.previewImage') && this.uploadRow) {
            this.getEl().child('.box').setStyle('background-image', 'url(/assets/ext2/resources/images/default/grid/loading.gif)');
            var img = new Image();
            img.onload = (function () {
                this.getEl().child('.box').setStyle('background-image', 'none');
            }).createDelegate(this);
            img.src = this._generatePreviewUrl(previewUrl);
            this.getEl().child('.previewImage')
                .setStyle('background-image', 'url('+this._generatePreviewUrl(previewUrl)+')');
        }
    },

    validateValue : function(value)
    {
        if (!value){ // if it's blank
             if (this.allowBlank){
                 this.clearInvalid();
                 return true;
             } else {
                 this.markInvalid(trlKwf('This field is required'));
                 return false;
             }
        }
        return true;
    }

});
