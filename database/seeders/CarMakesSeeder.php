<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CarMakesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Active marques with strong presence in Europe (2024–2025).
        $names = [
            // Volkswagen Group
            'Volkswagen','Skoda','Seat','Cupra','Audi','Porsche',

            // Stellantis (EU focus)
            'Peugeot','Citroen','DS Automobiles','Opel','Vauxhall',
            'Fiat','Abarth','Alfa Romeo','Lancia',

            // Renault Group
            'Renault','Dacia','Alpine',

            // German premium
            'BMW','MINI','Mercedes-Benz','Smart',

            // Nordics / UK
            'Volvo','Polestar','Jaguar','Land Rover',

            // Mainstream Japan (big EU share)
            'Toyota','Lexus','Nissan','Mazda','Suzuki','Honda',

            // Korea (big EU share)
            'Hyundai','Kia','Genesis',

            // US (with notable EU market presence)
            'Ford','Tesla',

            // China brands growing fast in EU
            'MG','BYD','Ora','Lynk & Co','Nio','Xpeng',

            // Off-road / lifestyle with EU sales
            'Jeep',
        ];

        $carMakes = array_map(fn ($n) => ['name' => $n], $names);

        DB::table('car_makes')->insertOrIgnore($carMakes);
    }
}
