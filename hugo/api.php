<?php 

// Pfade zur .env-Datei
$envFilePath = __DIR__ . '/.env';

// Lese die .env-Datei ein
if (file_exists($envFilePath)) {
    $envContent = file_get_contents($envFilePath);

    // Teile den Inhalt in Zeilen auf
    $envLines = explode("\n", $envContent);

    // Iteriere über die Zeilen und setze die Umgebungsvariablen
    foreach ($envLines as $line) {
        $line = trim($line);

        // Überspringe leere Zeilen und Kommentare
        if (empty($line) || strpos($line, '#') === 0) {
            continue; 
        }

        // Teile die Zeile in Schlüssel und Wert auf
        list($key, $value) = explode('=', $line, 2);

        // Setze die Umgebungsvariable
        $_ENV[$key] = $value;
    }

    if(!empty($_ENV['api_key']))
    {
        echo json_encode(array('api' => $_ENV['api_key']));
    } else {
        echo json_encode(array('error' => 'No API KEy found'));
    }
}
 
