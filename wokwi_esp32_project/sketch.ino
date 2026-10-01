const int trigPin = 5;
const int echoPin = 18;

const int ledGreen = 2;
const int ledYellow = 4;
const int ledRed = 16;

const int timePotPin = 34;

// Room device switch
// LOW  = ON
// HIGH = OFF
const int roomSwitchPin = 25;

const int buzzerPin = 32;

void setup() {
  Serial.begin(115200);

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  pinMode(ledGreen, OUTPUT);
  pinMode(ledYellow, OUTPUT);
  pinMode(ledRed, OUTPUT);

  pinMode(roomSwitchPin, INPUT_PULLUP);
  pinMode(buzzerPin, OUTPUT);

  // Initial state
  digitalWrite(ledRed, LOW);
  digitalWrite(ledYellow, LOW);
  digitalWrite(ledGreen, HIGH);
  noTone(buzzerPin);

  Serial.println("==============================================");
  Serial.println("CampusIQ Smart Campus Facility Monitoring");
  Serial.println("==============================================");
}

void loop() {

  // -----------------------------
  // 1. Simulated Campus Time
  // -----------------------------
  int potValue = analogRead(timePotPin);
  int currentHour = map(potValue, 0, 4095, 0, 23);

  // -----------------------------
  // 2. Room Device Status
  // -----------------------------
  bool isRoomDeviceOn =
      (digitalRead(roomSwitchPin) == LOW);

  // -----------------------------
  // 3. Ultrasonic Sensor
  // -----------------------------
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);

  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH, 30000);

  long distanceCm = 0;

  if (duration > 0) {
    distanceCm = duration * 0.034 / 2;
  }

  // -----------------------------
  // 4. Serial Monitor
  // -----------------------------
  Serial.println("----------------------------------------------");

  Serial.print("Campus Time: ");

  if (currentHour < 10) {
    Serial.print("0");
  }

  Serial.print(currentHour);
  Serial.println(":00");

  Serial.print("Room Devices: ");

  if (isRoomDeviceOn) {
    Serial.println("ON");
  } else {
    Serial.println("ALL OFF");
  }

  Serial.print("Waste Distance: ");
  Serial.print(distanceCm);
  Serial.println(" cm");

  // ==================================================
  // MAIN CAMPUS ENERGY RULE
  // ==================================================

  if (isRoomDeviceOn) {

    // ANY DEVICE IS ON
    // RED stays ON continuously

    digitalWrite(ledRed, HIGH);
    digitalWrite(ledGreen, LOW);
    digitalWrite(ledYellow, LOW);

    Serial.println("STATUS: ACTIVE LOAD");
    Serial.println("RED LED: ON");
    Serial.println("Reason: Light/Fan/AC is ON");

    // ==================================================
    // SIREN BUZZER OCCUPANCY RULE:
    // DO NOT use buzzer sound when class is occupied!
    // ONLY sound emergency siren when class is EMPTY.
    // Ultrasonic sensor detects student occupancy:
    // < 100cm = Students present (Occupied) -> Siren MUTED
    // >= 100cm = Room vacant (Empty) -> Siren buzzer WAILS
    // ==================================================
    bool isClassOccupied = (distanceCm < 100 && distanceCm > 0);

    if (!isClassOccupied) {
      Serial.println("SIREN: Empty classroom leak detected! Wailing emergency siren...");
      // High-tech rising and falling emergency siren wail
      for (int f = 650; f <= 1250; f += 50) {
        tone(buzzerPin, f);
        delay(12);
      }
      for (int f = 1250; f >= 700; f -= 50) {
        tone(buzzerPin, f);
        delay(12);
      }
      noTone(buzzerPin);
      delay(250);
    } else {
      Serial.println("STATUS: Class is OCCUPIED. Siren buzzer is MUTED (no lecture disturbance).");
      noTone(buzzerPin);
      delay(350);
    }

  } else {

    // ALL DEVICES ARE OFF
    // GREEN stays ON

    digitalWrite(ledRed, LOW);
    digitalWrite(ledYellow, LOW);
    digitalWrite(ledGreen, HIGH);

    noTone(buzzerPin);

    Serial.println("STATUS: ECO-SAFE");
    Serial.println("GREEN LED: ON");
    Serial.println("All devices are OFF");

    delay(100);
  }
}