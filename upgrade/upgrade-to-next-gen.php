#!/usr/bin/php
<?php

function glob_recursive($pattern, $flags = 0) {
    $files = glob($pattern, $flags);
    foreach (glob(dirname($pattern).'/*', GLOB_ONLYDIR|GLOB_NOSORT) as $dir) {
        if (dirname($dir) == './kwf-lib' || $dir == './kwf-lib') continue;
        if (dirname($dir) == './vkwf-lib' || $dir == './vkwf-lib') continue;
        if (dirname($dir) == './library' || $dir == './library') continue;
        if (dirname($dir) == './vendor' || $dir == './vendor') continue;
        $files = array_merge($files, glob_recursive($dir.'/'.basename($pattern), $flags));
    }
    return $files;
}

foreach (glob_recursive('*.js') as $file) {
    $c = file_get_contents($file);
    $origC = $c;
    $c = str_replace('KwfExt.grid.ViewController', 'KwfExt.grid.PanelController', $c);
    $c = str_replace('KwfExt.form.ViewController', 'KwfExt.form.PanelController', $c);
    if ($c != $origC) {
        echo "Renamed ViewController: $file\n";
        file_put_contents($file, $c);
    }

    $origC = $c;
    $c = str_replace("extend: 'Ext.grid.Panel'", "extend: 'KwfExt.grid.Panel'", $c);
    if ($c != $origC) {
        echo "Extend KwfExt Panel: $file\n";
        file_put_contents($file, $c);
    }
}

$renamedClasses = array();

foreach (glob_recursive('ViewModel.js') as $file) {
    if (substr($file, -13) != '/ViewModel.js') continue;
    $c = file_get_contents($file);
    $origC = $c;
    if (preg_match("#Ext\.define\('(.*?)'#", $c, $m)) {
        $class = $m[1];
        $newClass = $m[1];
        $newClass = substr($newClass, 0, -10);
        $newClass = substr($newClass, 0, strrpos($newClass, '.')+1).ucfirst(substr($newClass, strrpos($newClass, '.')+1));
        $newClass .= 'Model';
        $c = str_replace($m[0], "Ext.define('".$newClass."'", $c);
        $renamedClasses[$class] = $newClass;
    }
    if ($c != $origC) {
        echo "Renamed ViewModel: $file\n";
        file_put_contents($file, $c);
    }
    $newFile = substr($file, 0, -13);
    $newFile = substr($newFile, 0, strrpos($newFile, '/')+1).ucfirst(substr($newFile, strrpos($newFile, '/')+1));
    $newFile .= 'Model.js';
    rename($file, $newFile);
    echo "renamed $file -> $newFile\n";
}

foreach (glob_recursive('*.js') as $file) {
    $c = file_get_contents($file);
    $origC = $c;
    foreach ($renamedClasses as $old=>$new) {
        $c = str_replace($old, $new, $c);
    }
    if ($c != $origC) {
        echo "Updated renamed classes: $file\n";
        file_put_contents($file, $c);
    }
}
