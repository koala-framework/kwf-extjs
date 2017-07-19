    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no" />
    <style type="text/css">
    #loading {
        position:absolute;
        left:45%;
        top:40%;
        padding:2px;
        z-index:20001;
        height:auto;
        border:1px solid #ccc;
        min-width: 100px;
    }
    #loading .loading-indicator{
        background:#f6f6f6;
        color:#444;
        font:bold 13px tahoma,arial,helvetica;
        padding:10px;
        margin:0;
        height:auto;
    }
    #loading .loading-indicator img {
        margin-right:8px;
        float:left;
        vertical-align:top;
    }
    #loading-msg {
        font: normal 10px arial,tahoma,sans-serif;
    }
    </style>

    <script type="text/javascript">
        document.write('<div id="loading">');
          document.write('<div class="loading-indicator">');
            document.write('<?=$this->image('/assets/ext2/resources/images/default/shared/large-loading.gif')?>');
            document.write('<?= $this->applicationName ?><br /><span id="loading-msg"><?= trlKwf('Loading...') ?></span></div>');
        document.write('</div>');
        var Kwf = {isApp: true};
        <?php if (!$this->uniquePrefix) { ?>
        var Ext = {};
        <?php } ?>
    </script>

    <?= $this->debugData() ?>
    <?= $this->assets($this->assetsPackage) ?>

    <script type="text/javascript">
    (function() {
        <?php if ($this->uniquePrefix) { ?>
            var Kwf = <?=$this->uniquePrefix?>.Kwf;
        <?php } ?>
        <?php if ($this->user) { ?>
        Kwf.userId = '<?= $this->user->id ?>';
        <?php } ?>
        Kwf.userRole = '<?= $this->userRole ?>';
        <?php if (isset($this->sessionToken)) { ?>
        Kwf.sessionToken = '<?= $this->sessionToken ?>';
        <?php } ?>
        Kwf.main = function() {
            <?php if ($this->uniquePrefix) { ?>
                var Ext = <?=$this->uniquePrefix?>.Ext;
            <?php } ?>
            Ext.application('App.controller.<?=$this->extController?>');
        };
    })();
    </script>
