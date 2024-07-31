<?php

/**
 * @package     local_hugo
 * @author      Neox
 */

require_once(__DIR__ . '/../../config.php');

defined('MOODLE_INTERNAL') || die();

$PAGE->set_url(new moodle_url('/local/hugo/lehrer_quellen.php'));
$PAGE->set_context(\context_system::instance());
$PAGE->set_title(get_string('plugin_title_lehrer', 'local_hugo'));
$PAGE->requires->js('/local/hugo/assets/js/lehrer_quellen/script.js');
$PAGE->requires->css('/local/hugo/assets/css/lehrer_quellen/style.css');


//For Devmode uncomment this:
$PAGE->set_cacheable(false);

$requirements = $PAGE->requires;

//HEAD
$PAGE->set_state(moodle_page::STATE_PRINTING_HEADER);
$templatecontext = (object)[
  'output' => $OUTPUT,
];


echo $OUTPUT->render_from_template('local_hugo/lehrer/head', $templatecontext);

$redirect = isloggedin() ? '/' : '/login/index.php';

$USER->id ??= 0;

//CONTENT
$PAGE->set_state(moodle_page::STATE_IN_BODY);
$templatecontext = (object)[
  'output' => $OUTPUT,
  'bodyattributes' => $OUTPUT->body_attributes([]),
  'close_request' => get_string('close_request', 'local_hugo'),
  'yes' => get_string('yes', 'local_hugo'),
  'no' => get_string('no', 'local_hugo'),
  'chat' => get_string('chat', 'local_hugo'),
  'auswahl_lehrer' => get_string('auswahl_lehrer', 'local_hugo'),
  'quellen' => get_string('manage_source', 'local_hugo'),
  'plugin_close' => get_string('interaction_close', 'local_hugo'),
  'cancel' => get_string('cancel', 'local_hugo'),
  'placeholder_input' => get_string('placeholder_input', 'local_hugo'),
  'hallo' => get_string('hallo', 'local_hugo'),
  'hugo' => get_string('hugo', 'local_hugo'),
  'frage' => get_string('frage', 'local_hugo'),
  'isloggedin' => isloggedin(),
  'redirect' => $redirect,
  'user_id' => $USER->id,
];

echo $OUTPUT->render_from_template('local_hugo/lehrer_quellen/index', $templatecontext);

echo "<script>window.source_ids = ".json_encode($_SESSION['source_ids'])."</script>";

//FOR BODY
$templatecontext = (object)[
  'output' => $OUTPUT,
  'end' => $requirements->get_end_code(),
];

echo $OUTPUT->render_from_template('local_hugo/lehrer_quellen/footer', $templatecontext);

$PAGE->set_state(moodle_page::STATE_DONE);
