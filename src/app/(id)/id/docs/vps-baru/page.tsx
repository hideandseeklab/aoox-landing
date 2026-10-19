import { PathArrow } from "@/components/arrows"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import {
  Callout,
  Code,
  DocLink,
  DocPage,
  H2,
  H3,
  P,
  Pre,
  Step,
  Steps,
  Table,
  Ul,
} from "@/components/docs/prose"

import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/id/docs/vps-baru",
  lang: "id",
  title: "Mulai dari VPS baru",
  description:
    "Panduan lengkap dari VPS kosong sampai panel aoox aktif di domain sendiri: SSH, user sudo, firewall, instalasi, HTTPS.",
})

const SUMMARY = [
  { k: "Waktu", v: "± 30 menit (DNS bisa lebih lama)" },
  { k: "Butuh", v: "VPS Linux baru (amd64 atau arm64) dan, untuk HTTPS, sebuah domain" },
  { k: "Hasil", v: "Panel di https://panel.example.com" },
]

const NEXT = [
  {
    title: "Domain untuk panel",
    description: "Semua opsi domain panel, termasuk menghapusnya.",
    href: "/id/docs/domain-panel",
  },
  {
    title: "Web terminal",
    description: "User SSH dan key di balik menu Terminal.",
    href: "/id/docs/terminal",
  },
  {
    title: "Backup & restore",
    description: "Backup instance, backup database dan volume, S3.",
    href: "/id/docs/backup#instance",
  },
  {
    title: "Troubleshooting",
    description: "Masalah umum dan cara mengatasinya.",
    href: "/id/docs/troubleshooting",
  },
]

export default function Page() {
  return (
    <DocPage
      href="/id/docs/vps-baru"
      title="Mulai dari VPS baru"
      lang="id"
      description="Semua langkah dari VPS baru sampai panel aoox bisa dibuka di domain sendiri, siap disalin dan berurutan."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3 rounded-lg overflow-hidden">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">
              {item.k}
            </dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <P>
        Placeholder yang dipakai di bawah: <Code>SERVER_IP</Code> adalah IP
        publik VPS-mu, <Code>your-user</Code> adalah login yang kamu buat di
        langkah 4, dan <Code>panel.example.com</Code> /{" "}
        <Code>api.panel.example.com</Code> adalah nama domainmu sendiri. Sudah
        punya server dengan Docker dan hanya butuh instalasinya? Lihat{" "}
        <DocLink href="/id/docs/instalasi">Instalasi</DocLink>.
      </P>

      <H2 id="pilih">1. Memilih VPS</H2>
      <Table
        head={["", "Minimum", "Disarankan"]}
        rows={[
          ["CPU", "1 vCPU", "2 vCPU atau lebih"],
          ["RAM", "2 GB (tambah swap, langkah 5)", "4 GB atau lebih"],
          ["Disk", "25 GB SSD", "40 GB SSD atau lebih"],
        ]}
      />
      <P>
        Angka ini panduan yang konservatif, bukan batas yang diukur. Panel
        sendiri tiga container (PostgreSQL, API, dan aplikasi web); reverse
        proxy dan registry lokal ditambahkan saat kamu mengaktifkannya; dan
        setiap build berjalan di mesin yang sama. Yang banyak memakai memori
        dan disk adalah build dan aplikasimu: image helper Nixpacks saja sekitar
        350 MB, image lama menumpuk, dan build yang kehabisan memori langsung
        gagal. Halaman Instalasi menyebut 1 vCPU / 1 GB cukup untuk aoox
        sendiri; sediakan lebih begitu kamu build di server itu.
      </P>
      <Ul>
        <li>
          <strong>Arsitektur: x86_64 (amd64) atau arm64.</strong> Image{" "}
          <Code>hideandseeklab/aoox-api</Code> dan{" "}
          <Code>hideandseeklab/aoox-web</Code> dipublikasikan untuk keduanya
          mulai rilis setelah 0.1.0-alpha.12. Image{" "}
          <strong>0.1.0-alpha.12 yang sekarang terbit hanya amd64</strong>, jadi
          VPS ARM (Ampere, Graviton) perlu menunggu rilis berikutnya; CLI aoox
          sendiri sudah punya build arm64.
        </li>
        <li>
          <strong>Sistem operasi: Linux umum dengan systemd, misalnya Ubuntu
          24.04 / 22.04 LTS atau Debian 12.</strong> Installer hanya memeriksa
          bahwa ia berjalan di Linux; syarat sebenarnya adalah distribusimu
          didukung skrip instalasi Docker (<Code>get.docker.com</Code>). Perintah
          di bawah ditulis untuk Ubuntu dan Debian. Alpine (musl) tidak didukung
          oleh CLI siap-pakai.
        </li>
        <li>
          <strong>Firewall / security group dari provider.</strong> Kalau
          providermu punya, buka masuk <Code>22</Code> (SSH), <Code>80</Code>{" "}
          dan <Code>443</Code> (HTTPS dan sertifikat), plus <Code>3000</Code>{" "}
          dan <Code>3001</Code> sampai domain berfungsi (80/443 baru menjawab setelah domain panel pertama
          disimpan, langkah 10). Jangan{" "}
          buka <Code>5000</Code> (registry lokal, langkah 11) kecuali kamu
          memakai node Swarm.
        </li>
      </Ul>

      <H2 id="ssh">2. Login SSH pertama</H2>
      <P>
        Provider menampilkan IP, user pertama (<Code>root</Code> di kebanyakan,
        <Code>ubuntu</Code> di sebagian image cloud), dan password atau key yang
        kamu pilih saat membuat server.
      </P>
      <Pre title="Windows (PowerShell), macOS, Linux">{`ssh root@SERVER_IP`}</Pre>
      <Callout title="Image cloud Ubuntu: usernya ubuntu, bukan root">
        Banyak image cloud Ubuntu (AWS, Oracle, Tencent, dan lain-lain)
        menonaktifkan login root dan memberi user sudo bernama{" "}
        <Code>ubuntu</Code>. Kalau begitu sambungkan dengan{" "}
        <Code>ssh ubuntu@SERVER_IP</Code> dan tambahkan <Code>sudo</Code> di
        depan perintah di bawah yang ditulis tanpa itu (langkah 3 dan 4). Kamu
        boleh melewati pembuatan user baru di langkah 4 dan memakai{" "}
        <Code>ubuntu</Code> sebagai <Code>your-user</Code>.
      </Callout>
      <P>
        Windows 10/11 sudah menyertakan klien OpenSSH, jadi perintah yang sama
        jalan di PowerShell. Pertama kali, SSH menampilkan fingerprint server dan
        bertanya <Code>Are you sure you want to continue connecting</Code>. Kalau
        providermu menampilkan fingerprint di konsolnya, cocokkan dulu; lalu
        ketik <Code>yes</Code>. Kalau server dibangun ulang dan SSH mengeluh
        host identification berubah, hapus entri lama dengan{" "}
        <Code>ssh-keygen -R SERVER_IP</Code>.
      </P>

      <H2 id="update">3. Perbarui sistem</H2>
      <Pre>{`sudo apt update && sudo apt upgrade -y`}</Pre>
      <P>
        Di Ubuntu, sebuah file muncul saat reboot diperlukan (misalnya setelah
        update kernel). Di Debian, reboot setelah upgrade kernel.
      </P>
      <Pre>{`[ -f /var/run/reboot-required ] && sudo reboot`}</Pre>
      <P>Sambung lagi dengan perintah <Code>ssh</Code> yang sama setelah sekitar semenit.</P>

      <H2 id="user">4. User sudo dan login dengan SSH key</H2>
      <P>
        Jangan bekerja sehari-hari sebagai <Code>root</Code>. Langkah ini juga
        penting untuk aoox: kalau kamu menginstal sebagai user sudo, aoox memakai
        user itu untuk <DocLink href="/id/docs/terminal">web terminal</DocLink>.
        Instalasi baru menulis <Code>TERMINAL_SSH_USER</Code> dengan user yang
        menjalankan <Code>sudo</Code> dan mengotorisasi key terminal untuknya;
        kalau kamu menginstal langsung sebagai <Code>root</Code>, user terminal
        adalah <Code>root</Code>, yang ditolak lewat SSH oleh kebanyakan image
        cloud. (Kalau image-mu sudah memberi user sudo seperti{" "}
        <Code>ubuntu</Code>, kamu boleh melewati pembuatan user dan memakainya.)
      </P>
      <Steps>
        <Step title="Buat user (di server)">
          <Pre>{`adduser your-user`}</Pre>
          <Pre>{`usermod -aG sudo your-user`}</Pre>
          <P>
            <Code>adduser</Code> meminta password dan beberapa detail opsional.
            Simpan passwordnya: <Code>sudo</Code> memintanya.
          </P>
        </Step>
        <Step title="Buat key di laptop (lewati kalau sudah punya)">
          <Pre>{`ssh-keygen -t ed25519 -C "kamu@laptop"`}</Pre>
          <P>
            Hasilnya <Code>~/.ssh/id_ed25519</Code> (privat, jangan dibagikan) dan{" "}
            <Code>~/.ssh/id_ed25519.pub</Code> (publik). Passphrase sebaiknya
            dipakai.
          </P>
        </Step>
        <Step title="Pasang public key di server">
          <P>macOS / Linux, dari laptop:</P>
          <Pre>{`ssh-copy-id your-user@SERVER_IP`}</Pre>
          <P>
            PowerShell Windows tidak punya <Code>ssh-copy-id</Code>; ini hasilnya
            sama (akan meminta password yang baru kamu buat):
          </P>
          <Pre>{`Get-Content $env:USERPROFILE\\.ssh\\id_ed25519.pub | ssh your-user@SERVER_IP "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"`}</Pre>
        </Step>
        <Step title="Tes di terminal kedua">
          <P>
            Biarkan sesi root tetap terbuka dan, di jendela terminal{" "}
            <strong>baru</strong>:
          </P>
          <Pre>{`ssh your-user@SERVER_IP`}</Pre>
          <Pre>{`sudo -v`}</Pre>
          <P>
            Kamu harus bisa masuk dengan key (tanpa password server; permintaan
            passphrase key tidak masalah), dan <Code>sudo -v</Code> menerima
            passwordmu. Lanjut hanya kalau keduanya berhasil.
          </P>
        </Step>
      </Steps>
      <H3>Opsional: matikan login password dan root</H3>
      <Callout kind="warn" title="Kamu bisa terkunci di luar">
        Lakukan ini hanya setelah langkah 4 berhasil di terminal kedua, dan
        biarkan sesi yang berfungsi itu terbuka sampai kamu menguji login baru
        sesudahnya. Kalau ada yang salah, kamu bisa terkunci dan butuh konsol web
        dari provider untuk memulihkan.
      </Callout>
      <P>
        Ubuntu dan Debian membaca file tambahan dari{" "}
        <Code>/etc/ssh/sshd_config.d/</Code> lebih dulu, dan untuk tiap setelan
        nilai pertama yang ditemukan yang dipakai, jadi file bawaan image cloud
        (sering <Code>50-cloud-init.conf</Code> dengan{" "}
        <Code>PasswordAuthentication yes</Code>) akan mengalahkan perubahan di{" "}
        <Code>sshd_config</Code> utama. File bernama <Code>10-…</Code> dibaca
        sebelumnya:
      </P>
      <Pre>{`sudo tee /etc/ssh/sshd_config.d/10-hardening.conf <<'EOF'
PasswordAuthentication no
PermitRootLogin no
EOF`}</Pre>
      <Pre>{`sudo sshd -t && sudo systemctl reload ssh`}</Pre>
      <P>
        <Code>sshd -t</Code> tidak mencetak apa-apa kalau konfigurasinya valid.
        Lalu buka terminal ketiga dan pastikan <Code>ssh your-user@SERVER_IP</Code>{" "}
        masih berfungsi. Dua catatan terkait aoox: web terminal masuk lewat SSH
        dengan key, jadi tetap jalan dengan <Code>PasswordAuthentication no</Code>;
        tetapi ia gagal kalau <Code>TERMINAL_SSH_USER</Code> adalah{" "}
        <Code>root</Code> dan login root dimatikan, dan kalau kamu membatasi SSH
        dengan <Code>AllowUsers</Code> user terminal harus tercantum. Lihat{" "}
        <DocLink href="/id/docs/terminal#user-ssh">User SSH di VPS cloud</DocLink>.
      </P>
      <P>Mulai sekarang, login sebagai <Code>your-user</Code>.</P>

      <H2 id="dasar">5. Dasar: zona waktu, swap, firewall</H2>
      <H3>Zona waktu</H3>
      <Pre>{`timedatectl list-timezones | grep -i jakarta`}</Pre>
      <Pre>{`sudo timedatectl set-timezone Asia/Jakarta`}</Pre>
      <P>
        Pilih zonamu dari daftar itu. Ini hanya mengatur jam host untuk log dan
        cron di host. Jadwal aoox sendiri (job, backup, pembersihan malam)
        berjalan di dalam container API yang memakai UTC kecuali kamu mengisi{" "}
        <Code>TZ</Code>. Supaya berjalan di zonamu, tambahkan ke{" "}
        <Code>.env.dist</Code> lalu buat ulang container API.{" "}
        <strong>Lakukan ini setelah langkah 8 (instalasi):</strong>{" "}
        <Code>/opt/aoox</Code> belum ada sebelumnya, jadi perintah di bawah
        gagal kalau dijalankan sekarang.
      </P>
      <Pre>{`echo 'TZ=Asia/Jakarta' | sudo tee -a /opt/aoox/.env.dist
cd /opt/aoox && sudo docker compose -f docker-compose.dist.yml --env-file .env.dist up -d`}</Pre>
      <P>
        Dashboard menampilkan zona yang dipakai di samping setiap field jadwal.
        Instalasi yang dibuat sebelum opsi ini ada perlu{" "}
        <Code>aoox reinstall</Code> dulu agar compose-nya meneruskan{" "}
        <Code>TZ</Code> ke API. Ekspresi cron yang sudah ada tetap angkanya,
        jadi periksa lagi setelah mengganti zona.
      </P>
      <H3>Swap (disarankan di bawah 4 GB RAM)</H3>
      <P>Swap file membuat build bertahan saat memori melonjak sebentar, bukannya dimatikan.</P>
      <P>
        Cek dulu: banyak image sudah membawa swap. Kalau salah satu perintah di
        bawah menampilkan baris swap berukuran, <strong>lewati bagian
        ini</strong> (menambah swap file kedua hanya membuang disk).
      </P>
      <Pre>{`swapon --show
free -h`}</Pre>
      <Pre>{`sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile`}</Pre>
      <Pre>{`echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab`}</Pre>
      <Pre>{`free -h`}</Pre>
      <P>
        <Code>free -h</Code> harus menampilkan 2.0Gi di baris Swap. Sebagian
        provider sudah menambah swap atau memakai filesystem yang tidak bisa
        menjadikan file hasil <Code>fallocate</Code> sebagai swap; kalau{" "}
        <Code>swapon</Code> mengeluh, cek <Code>swapon --show</Code> dulu.
      </P>
      <H3>Firewall (ufw)</H3>
      <Callout kind="warn" title="Izinkan SSH dulu">
        Tambahkan aturan SSH <strong>sebelum</strong> mengaktifkan ufw, kalau
        tidak sesimu sendiri terputus. Kalau SSH mendengarkan di port selain 22,
        pakai port itu.
      </Callout>
      <Pre>{`sudo apt install -y ufw`}</Pre>
      <Pre>{`sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw allow 3001/tcp
sudo ufw --force enable
sudo ufw status verbose`}</Pre>
      <P>
        <Code>--force</Code> penting kalau seluruh blok ditempel sekaligus:{" "}
        <Code>ufw enable</Code> biasa berhenti dan bertanya{" "}
        <Code>Command may disrupt existing ssh connections. Proceed with
        operation (y|n)?</Code>, lalu baris yang tersisa terbaca sebagai
        jawabannya, sehingga ufw tetap mati. Aturan SSH sudah ditambahkan lebih
        dulu, jadi mengaktifkannya tidak memutus sesimu.
      </P>
      <P>
        Port 3000/3001 hanya dibutuhkan sampai domain berfungsi (langkah 10).
        Biarkan aturan <Code>22</Code> terbuka untuk semua sumber: web terminal
        tersambung dari container API ke port SSH host, jadi aturan yang dibatasi
        ke IP-mu sendiri akan memblokirnya.
      </P>
      <Callout kind="warn" title="ufw tidak melindungi port yang dipublikasikan Docker">
        Docker mempublikasikan port container dengan mengarahkannya di tabel
        firewall miliknya sendiri, dan dokumentasinya menyebut lalu lintas itu
        dibelokkan sebelum mencapai chain yang dipakai ufw, sehingga aturan ufw
        pada dasarnya dilewati untuk port yang dipublikasikan. Akibatnya di
        sini: port 3000 dan 3001 tetap bisa dijangkau dari internet walau{" "}
        <Code>ufw deny 3000</Code>, dan hal yang sama berlaku untuk registry di
        port 5000 setelah kamu mengaktifkannya (dilindungi password, tetapi
        tetap terbuka) dan untuk host port yang kamu beri pada aplikasi. Untuk
        benar-benar menutupnya pakai <strong>firewall provider</strong> (ia
        menyaring sebelum lalu lintas sampai ke VM), dan untuk panel pakai
        saklar{" "}
        <DocLink href="/id/docs/domain-panel#hanya-domain">Hanya izinkan akses lewat domain</DocLink>,
        yang membuat port 3000/3001 hanya mendengarkan di <Code>127.0.0.1</Code>.
        ufw tetap berguna untuk semua yang tidak dipublikasikan Docker (SSH dan
        layanan host lain). Ini sudah diuji di VPS Ubuntu 24.04 sungguhan: port
        yang ditolak ufw tetap bisa dijangkau dari luar. aoox membantu di dua
        tempat: database atau aplikasi admin database yang kamu publikasikan
        diikat ke <Code>127.0.0.1</Code> secara default, dan setiap host port
        lain (aplikasi, stack) punya pilihan <strong>Mendengarkan di</strong>,{" "}
        <em>Publik</em> atau <em>Hanya server ini (127.0.0.1)</em>. Tab{" "}
        <strong>Port terbuka</strong> di halaman Docker (owner dan admin)
        menampilkan semua port yang dipublikasikan beserta pemiliknya dan
        apakah terbuka ke internet.
      </Callout>

      <H2 id="cli">6. Pasang CLI aoox (tanpa Node.js)</H2>
      <P>
        <Code>aoox install</Code> adalah perintah CLI aoox. Tarball CLI mandiri
        membawa Node.js sendiri, jadi kamu tidak perlu memasang Node.js di
        server. Jalankan dengan <Code>sudo</Code> agar terpasang di{" "}
        <Code>/usr/local/bin</Code>:
      </P>
      <Pre>{`curl -fsSL https://aoox.dev/install-cli.sh | sudo sh`}</Pre>
      <Pre>{`aoox --version`}</Pre>
      <Callout title="Kenapa pakai sudo di sini">
        Tanpa root atau sudo <em>tanpa password</em>, skrip mundur ke{" "}
        <Code>~/.local/bin</Code>, lalu <Code>sudo aoox install</Code> di
        langkah berikutnya menjawab <Code>command not found</Code> (sudo tidak
        mencari di folder itu). Didukung: Linux dengan glibc (x64 atau arm64)
        dan macOS.
      </Callout>
      <H3>Alternatif: npm (butuh Node.js 22 atau lebih baru)</H3>
      <P>
        CLI mensyaratkan <Code>node &gt;= 22</Code>. Di Ubuntu/Debian, Node 22
        dari NodeSource:
      </P>
      <Pre>{`curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -`}</Pre>
      <Pre>{`sudo apt-get install -y nodejs`}</Pre>
      <Pre>{`sudo npm install -g @hideandseeklab/aoox`}</Pre>

      <H2 id="docker">7. Docker</H2>
      <P>
        Kamu tidak harus memasangnya sendiri. <Code>aoox install</Code>{" "}
        memeriksa apakah <Code>docker info</Code> berfungsi; kalau Docker belum
        ada atau tidak jalan, ia menawarkan menjalankan skrip resmi Docker
        (<Code>curl -fsSL https://get.docker.com | sh</Code>) dan meminta
        konfirmasi (<Code>--yes</Code> melewati pertanyaan). Sesudahnya ia
        memeriksa Docker berfungsi dan berhenti dengan petunjuk
        (<Code>systemctl status docker</Code>) kalau tidak.
      </P>
      <P>
        Kalau kamu lebih suka memasang Docker sendiri dari repositori apt-nya
        dulu (Ubuntu; instalasi butuh plugin Compose v2):
      </P>
      <Pre>{`sudo apt update
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc`}</Pre>
      <Pre>{`sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "$VERSION_CODENAME")
Components: stable
Signed-By: /etc/apt/keyrings/docker.asc
EOF`}</Pre>
      <Pre>{`sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin`}</Pre>
      <P>
        Di Debian, ganti <Code>ubuntu</Code> dengan <Code>debian</Code> di URL
        key dan di baris <Code>URIs:</Code>. Cek dengan{" "}
        <Code>sudo docker compose version</Code>.
      </P>
      <Callout title="Grup docker bersifat opsional">
        <Code>aoox install</Code> berjalan sebagai root dan tidak membutuhkan
        usermu ada di grup <Code>docker</Code>. Menambahkannya
        (<Code>sudo usermod -aG docker your-user</Code>, lalu login ulang) hanya
        menghemat mengetik <Code>sudo</Code> sebelum <Code>docker</Code>, dan itu
        setara akses root ke server: siapa pun yang bisa menjalankan{" "}
        <Code>docker</Code> bisa me-mount seluruh filesystem. Lewati kecuali kamu
        mau kenyamanan itu.
      </Callout>

      <H2 id="install">8. Pasang aoox</H2>
      <P>Jalankan sebagai <Code>your-user</Code> (bukan login root), supaya user sudo menjadi user terminal:</P>
      <Pre>{`sudo aoox install`}</Pre>
      <P>Ia bertanya paling banyak dua hal, dan tidak ada dengan <Code>--yes</Code>:</P>
      <Ul>
        <li>
          <Code>Install Docker now via curl -fsSL https://get.docker.com | sh?</Code>{" "}
          hanya kalau Docker belum ada.
        </li>
        <li>
          <Code>Install aoox in /opt/aoox and run docker compose up -d? (Y/n)</Code>
        </li>
      </Ul>
      <P>Lalu ia melakukan, berurutan:</P>
      <Ul>
        <li>
          Membuat <Code>/opt/aoox</Code> (ubah dengan <Code>--dir</Code>) berisi{" "}
          <Code>docker-compose.dist.yml</Code> dan folder <Code>secrets/</Code>{" "}
          milik uid 1000 (user container API).
        </li>
        <li>
          Mendeteksi IP publik lewat <Code>api.ipify.org</Code> dan menulis{" "}
          <Code>/opt/aoox/.env.dist</Code> (mode 0600) dengan{" "}
          <Code>POSTGRES_PASSWORD</Code>, <Code>JWT_SECRET</Code>, dan{" "}
          <Code>ENCRYPTION_KEY</Code> yang baru dibuat acak,{" "}
          <Code>INSTALL_DIR=/opt/aoox</Code> (supaya dashboard nanti bisa
          mengganti domain panel tanpa setup tambahan), dan{" "}
          <Code>TERMINAL_SSH_USER=your-user</Code>.
        </li>
        <li>
          Membuat SSH key terminal di <Code>secrets/</Code> dan menambahkannya ke{" "}
          <Code>~/.ssh/authorized_keys</Code> milik <Code>your-user</Code>.
          Masalah di sini hanya peringatan (<Code>--no-terminal-authorize</Code>{" "}
          melewatinya).
        </li>
        <li>
          Menjalankan <Code>docker compose up -d</Code>, yang menarik PostgreSQL
          16 dan dua image aoox, lalu menunggu API sampai dua menit (ia
          menjalankan migrasi database di start pertama).
        </li>
      </Ul>
      <P>Perkirakan beberapa menit, kebanyakan untuk mengunduh image. Selesainya:</P>
      <Pre>{`aoox is installed in /opt/aoox.
Open: http://SERVER_IP:3000
Create the first owner account at /setup.`}</Pre>
      <Callout title="Port 80 dan 443 tertutup tepat setelah instalasi">
        Ini wajar, bukan blokir provider: reverse proxy yang mendengarkan di
        80/443 belum ada. Ia dijalankan saat kamu menyimpan domain panel pertama
        (langkah 10) atau kamu mengaktifkannya sendiri. Sampai saat itu hanya{" "}
        <Code>3000</Code> dan <Code>3001</Code> yang menjawab.
      </Callout>
      <Callout kind="warn" title="Periksa alamat yang dicetak">
        Kalau server gagal mendeteksi IP publiknya, barisnya berbunyi{" "}
        <Code>http://localhost:3000</Code>, dan <Code>WEB_ORIGIN</Code> di{" "}
        <Code>.env.dist</Code> juga localhost. Ganti dengan IP aslimu di{" "}
        <Code>WEB_ORIGIN</Code> dan <Code>PUBLIC_API_URL</Code>, lalu jalankan{" "}
        <Code>sudo docker compose -f docker-compose.dist.yml --env-file .env.dist up -d</Code>{" "}
        di <Code>/opt/aoox</Code>: sign-in dan terminal memeriksa bahwa alamat di
        browser sama persis dengan <Code>WEB_ORIGIN</Code>.
      </Callout>
      <P>Log dan status sesudahnya (file-nya milik root, jadi pakai sudo):</P>
      <Pre>{`cd /opt/aoox
sudo docker compose -f docker-compose.dist.yml --env-file .env.dist ps
sudo docker compose -f docker-compose.dist.yml --env-file .env.dist logs -f api`}</Pre>
      <Callout title="Menjalankan instalasi lagi">
        <Code>sudo aoox install</Code> menolak jalan lagi di folder yang sudah
        berisi instalasi. <Code>--force</Code> memasang ulang di atasnya: lebih
        dulu menyalin <Code>.env.dist</Code> dan file compose ke{" "}
        <Code>/opt/aoox/backups/&lt;timestamp&gt;/</Code> lalu mempertahankan
        secret yang ada, sehingga data tetap terbaca. Hanya{" "}
        <Code>--force --new-secrets --wipe-data</Code> yang mulai dari nol, dan
        itu menghapus database panel. Untuk memperbaiki atau menyegarkan
        instalasi pakai <Code>sudo aoox reinstall</Code> (langkah 11).
      </Callout>
      <Callout kind="warn" title="Install menolak: ada volume database sisa">
        Kalau <Code>/opt/aoox</Code> sudah dihapus tetapi Docker masih punya
        volume lama <Code>aoox_postgres_data</Code>, installer berhenti sebelum
        menulis apa pun: password database acak yang baru tidak bisa membuka
        data lama itu. Kembalikan <Code>.env.dist</Code> yang lama (misalnya dari{" "}
        <Code>/opt/aoox/backups/&lt;timestamp&gt;/</Code>) lalu jalankan{" "}
        <Code>sudo aoox reinstall</Code> untuk mempertahankan data, atau jalankan{" "}
        <Code>sudo aoox install --force --new-secrets --wipe-data</Code> untuk
        menghapus data itu dan mulai bersih.
      </Callout>
      <Callout title="Satu perintah tanpa CLI">
        Lebih suka satu baris? <Code>curl -fsSL https://aoox.dev/install.sh | sudo sh</Code>{" "}
        melakukan hal yang sama dengan environment variable sebagai ganti
        pertanyaan dan flag, dan hanya butuh <Code>curl</Code> dan <Code>sh</Code>.
        Lihat{" "}
        <DocLink href="/id/docs/instalasi#satu-perintah">Instalasi</DocLink>.
        CLI tetap bisa dipasang sesudahnya untuk <Code>aoox update</Code> dan{" "}
        <Code>aoox domain</Code>.
      </Callout>

      <H2 id="masuk">9. Sign-in pertama</H2>
      <Steps>
        <Step title="Buka dashboard">
          <P>
            Buka <Code>http://SERVER_IP:3000</Code>. Selama belum ada user, kamu
            dialihkan ke <Code>/setup</Code>.
          </P>
        </Step>
        <Step title="Buat owner">
          <P>
            Isi nama, email, dan password (minimal 8 karakter). Akun pertama ini
            adalah <strong>owner</strong>; user berikutnya diundang dari Settings (
            <DocLink href="/id/docs/pengguna-peran">Pengguna &amp; peran</DocLink>).
          </P>
        </Step>
        <Step title="Cek dari server (opsional)">
          <Pre>{`curl -s http://localhost:3001/auth/setup-status`}</Pre>
          <P>
            <Code>{`{"needsSetup":true}`}</Code> sebelum akun dibuat,{" "}
            <Code>{`{"needsSetup":false}`}</Code> sesudahnya.
          </P>
        </Step>
      </Steps>

      <H2 id="domain">10. Domain dengan HTTPS</H2>
      <Steps>
        <Step title="Buat dua record DNS A">
          <P>Di penyedia DNS-mu, arahkan dua nama ke IP server:</P>
          <Pre title="DNS">{`panel.example.com.       A   SERVER_IP
api.panel.example.com.   A   SERVER_IP`}</Pre>
          <P>
            Dashboard dan API butuh nama terpisah karena browser berbicara
            langsung ke API. Kalau memakai Cloudflare, set kedua record ke{" "}
            <em>DNS only</em> (awan abu-abu) selagi sertifikat diterbitkan.
          </P>
        </Step>
        <Step title="Tunggu sampai ter-resolve">
          <P>Dari laptop:</P>
          <Pre>{`nslookup panel.example.com`}</Pre>
          <P>
            Harus menjawab <Code>SERVER_IP</Code>. Sertifikat baru bisa terbit
            setelah DNS benar; percobaan yang gagal dihitung dalam batas laju
            (rate limit) Let&apos;s Encrypt.
          </P>
        </Step>
        <Step title={<>Atur domain panel (Settings<PathArrow />Domain panel)</>}>
          <P>
            Masuk sebagai owner, buka Settings<PathArrow />Domain panel, isi
            domain dashboard, domain API, dan email untuk Let&apos;s Encrypt, lalu{" "}
            <strong>Simpan &amp; terapkan</strong>. Port 80/443 harus kosong di
            server. Panel menyalakan reverse proxy sendiri kalau belum jalan,
            menulis ulang override compose, dan me-recreate container web dan API,
            jadi halaman terputus beberapa detik. Atau lewat CLI:
          </P>
          <Pre>{`aoox login`}</Pre>
          <Pre>{`aoox domain set --web panel.example.com --api api.panel.example.com --acme-email kamu@example.com`}</Pre>
        </Step>
        <Step title="Buka https://panel.example.com">
          <P>
            Sertifikat diminta saat host pertama kali diakses, jadi tunggu
            beberapa detik. Login lagi: sesi dari alamat IP tidak terbawa ke
            origin baru. Cek:
          </P>
          <Pre>{`curl -I https://panel.example.com`}</Pre>
        </Step>
        <Step title="Opsional: hanya izinkan akses lewat domain">
          <P>
            Setelah alamat HTTPS terbuka, aktifkan{" "}
            <strong>Hanya izinkan akses lewat domain</strong> di Settings
            <PathArrow />Domain panel (atau tambahkan <Code>--domain-only</Code>{" "}
            pada perintah di atas). Port 3000/3001 lalu hanya mendengarkan di{" "}
            <Code>127.0.0.1</Code>. Hapus aturan ufw yang kini tak berguna dan,
            kalau kamu membukanya, aturan firewall provider untuk 3000/3001:
          </P>
          <Pre>{`sudo ufw delete allow 3000/tcp
sudo ufw delete allow 3001/tcp`}</Pre>
        </Step>
      </Steps>
      <Callout kind="warn" title="Aktifkan saklar ini hanya setelah HTTPS berfungsi">
        Kalau domain rusak belakangan (DNS, sertifikat, firewall),{" "}
        <Code>IP:3000</Code> juga tidak menjawab lagi. Cara memulihkan lewat SSH
        ada di{" "}
        <DocLink href="/id/docs/domain-panel#hanya-domain">Domain untuk panel</DocLink>.
        Domain juga bisa diberikan saat instalasi
        (<Code>--web-domain</Code>, <Code>--api-domain</Code>,{" "}
        <Code>--acme-email</Code>) kalau DNS sudah mengarah ke server, sehingga
        langkah di dashboard terlewati.
      </Callout>

      <H2 id="setelah">11. Setelah instalasi</H2>
      <Ul>
        <li>
          <strong>Terminal.</strong> Instalasi baru sudah mengotorisasi key
          terminal untuk usermu, jadi buka menu <strong>Terminal</strong>. Hanya
          kalau instalasi mencetak{" "}
          <Code>warning: terminal key not authorized automatically</Code> (atau
          Terminal menampilkan error autentikasi), pakai tombol owner{" "}
          <strong>Authorize automatically</strong> di
          Infrastruktur<PathArrow />Terminal access, atau jalankan perintah yang
          ditampilkan sebagai user yang sama. Detail di{" "}
          <DocLink href="/id/docs/terminal#setup">Web terminal</DocLink>.
        </li>
        <li>
          <strong>Registry dan proxy.</strong> Aktifkan{" "}
          <DocLink href="/id/docs/registry">registry lokal</DocLink> sebelum
          deploy pertama dari repo Git. Reverse proxy dinyalakan otomatis saat
          kamu menyimpan domain panel.
        </li>
        <li>
          <strong>Backup panel.</strong> Atur{" "}
          <DocLink href="/id/docs/backup#instance">Backup instance</DocLink>{" "}
          (Settings<PathArrow />Instance backup), dengan jadwal dan sebaiknya
          tujuan S3, dan unduh salinannya ke luar server. Restore butuh{" "}
          <Code>ENCRYPTION_KEY</Code> yang sama, jadi simpan juga salinan privat{" "}
          <Code>/opt/aoox/.env.dist</Code> di tempat selain server ini.
        </li>
        <li>
          <strong>Memperbarui.</strong> <Code>aoox update panel --apply</Code>{" "}
          (atau Settings<PathArrow />Update aoox) menarik image baru dan
          me-restart stack; <Code>aoox update</Code> memperbarui CLI-nya sendiri.
          Keduanya tidak pernah menulis ulang file compose atau menambah variabel
          baru ke <Code>.env.dist</Code>. Saat sebuah rilis membutuhkannya,
          jalankan <Code>sudo aoox reinstall</Code> (coba <Code>--dry-run</Code>{" "}
          dulu): ia menulis ulang file compose, menggabungkan{" "}
          <Code>.env.dist</Code> tanpa membuat ulang secret, dan me-recreate
          container tanpa menyentuh data. Lihat{" "}
          <DocLink href="/id/docs/cli#update">Update aoox</DocLink> dan{" "}
          <DocLink href="/id/docs/cli#reinstall">aoox reinstall</DocLink>.
        </li>
      </Ul>

      <H3>Kalau ada yang salah</H3>
      <Table
        head={["Gejala", "Periksa"]}
        rows={[
          [
            <>Browser tidak bisa membuka <Code>IP:3000</Code></>,
            <>Firewall / security group provider (ufw tidak berpengaruh untuk port yang dipublikasikan Docker). Di server: <Code>sudo docker compose … ps</Code>.</>,
          ],
          [
            <><Code>IP:80</Code> / <Code>IP:443</Code> tidak menjawab setelah instalasi</>,
            <>Wajar sampai domain panel pertama disimpan (langkah 10): reverse proxy belum berjalan.</>,
          ],
          [
            "Proxy tidak bisa bind 80/443",
            <>Ada yang lain (Apache/nginx bawaan) memakainya: <Code>sudo ss -ltnp | grep -E &quot;:(80|443) &quot;</Code>, hentikan dan nonaktifkan.</>,
          ],
          [
            "Sertifikat tidak kunjung datang (sertifikat self-signed / default)",
            <>DNS belum menyebar, port 80 diblokir di provider, atau rate limit Let&apos;s Encrypt setelah gagal berulang. Coba dengan <Code>PROXY_ACME_STAGING=true</Code>. Lihat <DocLink href="/id/docs/domain-panel#jebakan">Jebakan umum</DocLink>.</>,
          ],
          [
            "Login berputar atau terminal bilang origin not allowed",
            <><Code>WEB_ORIGIN</Code> berbeda dari alamat di browser.</>,
          ],
          [
            "Terminal: SSH authentication failed",
            <><Code>TERMINAL_SSH_USER</Code> salah atau key belum diotorisasi. Lihat <DocLink href="/id/docs/terminal#user-ssh">User SSH di VPS cloud</DocLink>.</>,
          ],
        ]}
      />
      <P>
        Selengkapnya di <DocLink href="/id/docs/troubleshooting">Troubleshooting</DocLink>.
      </P>

      <H2 id="berikutnya">Langkah berikutnya</H2>
      <div className="grid gap-px border border-border bg-border sm:grid-cols-2 rounded-lg overflow-hidden">
        {NEXT.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-start justify-between gap-3 bg-background p-4 transition-colors hover:bg-muted/60"
          >
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{item.title}</span>
              <span className="text-xs text-muted-foreground">{item.description}</span>
            </span>
            <ArrowRight className="mt-1 size-3 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
          </Link>
        ))}
      </div>
    </DocPage>
  )
}
