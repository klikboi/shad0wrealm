// ════════════════════════════════════════════
//  HACK_OS // INTERACTIVE TERMINAL
// ════════════════════════════════════════════

const BANNER = `
<span class="t-green">██╗  ██╗ █████╗  ██████╗██╗  ██╗    ██████╗ ███████╗</span>
<span class="t-green">██║  ██║██╔══██╗██╔════╝██║ ██╔╝   ██╔═══██╗██╔════╝</span>
<span class="t-green">███████║███████║██║     █████╔╝    ██║   ██║███████╗</span>
<span class="t-green">██╔══██║██╔══██║██║     ██╔═██╗    ██║   ██║╚════██║</span>
<span class="t-green">██║  ██║██║  ██║╚██████╗██║  ██╗   ╚██████╔╝███████║</span>
<span class="t-green">╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝   ╚═════╝ ╚══════╝</span>
<span class="t-dim">HACK_OS v1.0 // kernel 1.337 // Type <span class="t-green">help</span> for commands</span>
<span class="t-dim">────────────────────────────────────────────────────</span>
`;

const FILESYSTEM = {
  '/root': ['README.md', 'payload.py', '.bash_history', 'tools/'],
  '/classified': ['REDACTED.txt', 'keys.gpg', 'mission_brief.enc'],
  '/breach_protocols': ['phase1.sh', 'phase2.sh', 'cleanup.sh', 'notes.txt'],
  '/tools': ['nmap', 'metasploit', 'burp', 'wireshark', 'john', 'hashcat'],
};

const FILE_CONTENTS = {
  'README.md': `<span class="t-green">## HACK_OS README</span>
Welcome to your personal hacking environment.
Update this site by editing the HTML templates.

<span class="t-dim">Author: YOU
Version: 1.0
License: FOSS (Free & Open Source Skulls)</span>`,
  'payload.py': `<span class="t-dim">#!/usr/bin/env python3
# [CLASSIFIED] payload delivery system
import socket, struct
# ... contents encrypted ...
<span class="t-warn">[ACCESS DENIED: clearance level insufficient]</span></span>`,
  '.bash_history': `<span class="t-dim">nmap -sV -sC 10.0.0.1
ssh root@target.htb
hashcat -m 0 hash.txt rockyou.txt
python3 exploit.py --target 192.168.1.1
burpsuite &
strings binary | grep pass
nc -lvnp 4444</span>`,
  'REDACTED.txt': `<span class="t-warn">████████ ██████████ ██ ██████ ██████████ ████
██ ████████ ██ ██████ TARGET: ██████████ ████
OPERATION STATUS: ██████████ // ██████████</span>`,
  'notes.txt': `<span class="t-green">BREACH PROTOCOL NOTES:</span>
<span class="t-dim">Phase 1: Recon — Passive fingerprinting, OSINT
Phase 2: Enum  — Port scan, service detection
Phase 3: Exploit — Choose your vector
Phase 4: Persist — Establish foothold
Phase 5: Cover  — Clean logs, stay ghost</span>`,
};

const COMMANDS = {
  help: cmdHelp,
  whoami: cmdWhoami,
  ls: cmdLs,
  dir: cmdLs,
  cat: cmdCat,
  pwd: cmdPwd,
  cd: cmdCd,
  clear: cmdClear,
  nmap: cmdNmap,
  ping: cmdPing,
  sudo: cmdSudo,
  skills: cmdSkills,
  hack: cmdHack,
  matrix: cmdMatrix,
  contact: cmdContact,
  history: cmdHistory,
  ifconfig: cmdIfconfig,
  uname: cmdUname,
  date: cmdDate,
  echo: cmdEcho,
  man: cmdMan,
  exit: cmdExit,
};

let currentDir = '/root';
let cmdHistory = [];
let histIdx = -1;
let output, input;

function initTerminal() {
  // Wait for DOM to settle
  setTimeout(() => {
    output = document.getElementById('terminal-output');
    input  = document.getElementById('terminal-input');
    if (!output || !input) return;

    output.innerHTML = BANNER;

    input.addEventListener('keydown', handleKey);
    input.focus();

    // Re-focus terminal when clicking its window
    const termWin = document.getElementById('win-terminal');
    if (termWin) {
      termWin.addEventListener('click', () => {
        setTimeout(() => input && input.focus(), 50);
      });
    }
  }, 100);
}

function handleKey(e) {
  if (e.key === 'Enter') {
    const cmd = input.value.trim();
    input.value = '';
    histIdx = -1;
    if (cmd) {
      cmdHistory.unshift(cmd);
      if (cmdHistory.length > 100) cmdHistory.pop();
      echoCmd(cmd);
      runCommand(cmd);
    } else {
      echoCmd('');
    }
    return;
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault();
    histIdx = Math.min(histIdx + 1, cmdHistory.length - 1);
    input.value = cmdHistory[histIdx] || '';
    return;
  }

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    histIdx = Math.max(histIdx - 1, -1);
    input.value = histIdx < 0 ? '' : cmdHistory[histIdx];
    return;
  }

  if (e.key === 'l' && e.ctrlKey) {
    e.preventDefault();
    cmdClear();
    return;
  }

  if (e.key === 'Tab') {
    e.preventDefault();
    // Basic tab-complete for commands
    const partial = input.value.trim();
    const match = Object.keys(COMMANDS).find(c => c.startsWith(partial) && c !== partial);
    if (match) input.value = match;
  }
}

function echoCmd(cmd) {
  const line = document.createElement('div');
  line.innerHTML = `<span class="t-green">root@hackos</span><span class="t-dim">:</span><span class="t-info">${escHtml(currentDir)}</span><span class="t-dim">$</span> <span class="cmd-echo">${escHtml(cmd)}</span>`;
  output.appendChild(line);
  scrollBottom();
}

function print(html, className = '') {
  const div = document.createElement('div');
  if (className) div.className = className;
  div.innerHTML = html;
  output.appendChild(div);
  scrollBottom();
}

function scrollBottom() {
  if (output) output.scrollTop = output.scrollHeight;
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function runCommand(raw) {
  const parts = raw.trim().split(/\s+/);
  const cmd   = parts[0].toLowerCase();
  const args  = parts.slice(1);

  if (COMMANDS[cmd]) {
    COMMANDS[cmd](args);
  } else {
    print(`<span class="t-err">bash: ${escHtml(cmd)}: command not found</span>`);
    print(`<span class="t-dim">Try <span class="t-green">help</span> for available commands.</span>`);
  }
  print(''); // blank line
}

// ── COMMANDS ───────────────────────────────

function cmdHelp() {
  print(`
<span class="t-green">╔══════════════════════════════════════════════╗</span>
<span class="t-green">║          HACK_OS COMMAND REFERENCE           ║</span>
<span class="t-green">╚══════════════════════════════════════════════╝</span>

<span class="t-dim">NAVIGATION:</span>
  <span class="t-green">ls</span>           List directory contents
  <span class="t-green">cd [dir]</span>     Change directory
  <span class="t-green">pwd</span>          Print working directory
  <span class="t-green">cat [file]</span>   Read a file
  <span class="t-green">clear</span>        Clear terminal (ctrl+l)

<span class="t-dim">NETWORK:</span>
  <span class="t-green">nmap [host]</span>  Scan target host
  <span class="t-green">ping [host]</span>  Ping a host
  <span class="t-green">ifconfig</span>     Show network interfaces

<span class="t-dim">SYSTEM:</span>
  <span class="t-green">whoami</span>       Show current user info
  <span class="t-green">uname -a</span>     System information
  <span class="t-green">date</span>         Current date/time
  <span class="t-green">history</span>      Command history
  <span class="t-green">echo [text]</span>  Print text
  <span class="t-green">sudo [cmd]</span>   Execute with root powers

<span class="t-dim">PORTFOLIO:</span>
  <span class="t-green">skills</span>       List technical skills
  <span class="t-green">contact</span>      Show contact info

<span class="t-dim">FUN:</span>
  <span class="t-green">hack</span>         Initiate hack sequence
  <span class="t-green">matrix</span>       See how deep the rabbit hole goes
  <span class="t-green">man [cmd]</span>    Manual page
  <span class="t-green">exit</span>         Exit terminal
`);
}

function cmdWhoami() {
  print(`<span class="t-green">root</span>`);
  print(`<span class="t-dim">uid=0(root) gid=0(root) groups=0(root),1337(hackers)</span>`);
}

function cmdLs(args) {
  const dir = currentDir;
  const files = FILESYSTEM[dir] || FILESYSTEM['/root'];
  const long = args.includes('-la') || args.includes('-l') || args.includes('-a');

  if (long) {
    print(`<span class="t-dim">total ${files.length * 4}</span>`);
    print(`<span class="t-dim">drwxr-xr-x  2 root root 4096 Jan 01 13:37 <span class="t-info">.</span></span>`);
    print(`<span class="t-dim">drwxr-xr-x 18 root root 4096 Jan 01 13:37 <span class="t-info">..</span></span>`);
    files.forEach(f => {
      const isDir = f.endsWith('/');
      const perms = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
      const size  = Math.floor(Math.random() * 8000 + 500);
      const col   = isDir ? 't-info' : 't-green';
      print(`<span class="t-dim">${perms}  1 root root ${String(size).padStart(5)} Jan 01 13:37</span> <span class="${col}">${escHtml(f)}</span>`);
    });
  } else {
    const line = files.map(f =>
      f.endsWith('/') ? `<span class="t-info">${escHtml(f)}</span>` : `<span class="t-green">${escHtml(f)}</span>`
    ).join('  ');
    print(line);
  }
}

function cmdCd(args) {
  const target = args[0] || '/root';
  const normalized = target.startsWith('/') ? target : (currentDir + '/' + target).replace('//', '/');
  if (FILESYSTEM[normalized] || normalized === '/root') {
    currentDir = normalized;
  } else if (target === '..') {
    const parts = currentDir.split('/');
    parts.pop();
    currentDir = parts.join('/') || '/root';
  } else if (target === '~') {
    currentDir = '/root';
  } else {
    print(`<span class="t-err">bash: cd: ${escHtml(target)}: No such file or directory</span>`);
  }
}

function cmdPwd() {
  print(`<span class="t-green">${escHtml(currentDir)}</span>`);
}

function cmdCat(args) {
  if (!args[0]) { print(`<span class="t-err">cat: missing file operand</span>`); return; }
  const file = args[0];
  const content = FILE_CONTENTS[file];
  if (content) {
    print(content);
  } else {
    print(`<span class="t-err">cat: ${escHtml(file)}: No such file or directory</span>`);
  }
}

function cmdClear() {
  if (output) output.innerHTML = '';
}

function cmdNmap(args) {
  const target = args[0] || '192.168.1.1';
  const ports = [22, 80, 443, 8080, 3306, 5432, 6379, 9200];
  const open  = ports.filter(() => Math.random() > 0.5);

  print(`<span class="t-green">Starting Nmap 7.94 ( https://nmap.org )</span>`);
  print(`<span class="t-dim">Nmap scan report for ${escHtml(target)}</span>`);
  print(`<span class="t-dim">Host is up (0.00${Math.floor(Math.random()*90+10)}s latency).</span>`);
  print(`<span class="t-dim">Not shown: ${ports.length - open.length} closed ports</span>`);
  print(`<span class="t-dim">PORT      STATE  SERVICE     VERSION</span>`);

  const services = {22:'ssh OpenSSH 8.9',80:'http Apache 2.4.52',443:'https nginx 1.23',8080:'http-proxy',3306:'mysql 8.0',5432:'postgresql 14',6379:'redis 7.0',9200:'elasticsearch 8.0'};
  open.forEach(p => {
    print(`<span class="t-green">${String(p).padEnd(9)}OPEN   ${services[p] || 'unknown'}</span>`);
  });

  setTimeout(() => {
    print(`<span class="t-dim">Nmap done: 1 IP address (1 host up) scanned in ${(Math.random()*5+1).toFixed(2)} seconds</span>`);
    print('');
    scrollBottom();
  }, 1200);
}

function cmdPing(args) {
  const host = args[0] || '8.8.8.8';
  print(`<span class="t-dim">PING ${escHtml(host)}: 56 data bytes</span>`);
  let count = 0;
  const iv = setInterval(() => {
    if (count >= 4) { clearInterval(iv); return; }
    const ms = (Math.random() * 30 + 1).toFixed(3);
    print(`<span class="t-dim">64 bytes from ${escHtml(host)}: icmp_seq=${count+1} ttl=64 time=<span class="t-green">${ms} ms</span></span>`);
    scrollBottom();
    count++;
  }, 400);
}

function cmdSudo(args) {
  if (!args.length) { print(`<span class="t-err">sudo: command required</span>`); return; }
  if (args[0] === 'rm' && args.includes('-rf') && args.includes('/')) {
    print(`<span class="t-warn">⚠ Nice try. This is a hacker OS, not a chaos machine.</span>`);
    return;
  }
  print(`<span class="t-green">[sudo] password for root: </span>`);
  setTimeout(() => {
    print(`<span class="t-green">✓ Root confirmed. You ARE root. You're always root here.</span>`);
    print(`<span class="t-dim">Executing: ${escHtml(args.join(' '))}...</span>`);
    scrollBottom();
  }, 800);
}

function cmdSkills() {
  print(`
<span class="t-green">── SKILLS DATABASE ─────────────────────────────</span>

<span class="t-dim">OFFENSIVE:</span>
  <span class="t-green">★★★★★</span> Penetration Testing
  <span class="t-green">★★★★☆</span> Exploit Development
  <span class="t-green">★★★★☆</span> Reverse Engineering
  <span class="t-green">★★★★★</span> Web Application Testing

<span class="t-dim">LANGUAGES:</span>
  <span class="t-green">Python · Bash · C · JavaScript · SQL · Assembly</span>

<span class="t-dim">TOOLS:</span>
  <span class="t-green">Metasploit · Burp Suite · Wireshark · Nmap</span>
  <span class="t-green">GDB · pwndbg · IDA Pro · Ghidra · John</span>

<span class="t-dim">PLATFORMS:</span>
  <span class="t-green">HackTheBox · TryHackMe · CTFtime · VulnHub</span>
`);
}

function cmdHack(args) {
  const target = args[0] || 'mainframe';
  print(`<span class="t-warn">⚠ INITIATING HACK SEQUENCE ON ${escHtml(target).toUpperCase()}...</span>`);

  const steps = [
    'Scanning target...',
    'Identifying vulnerabilities...',
    'Exploiting CVE-2024-1337...',
    'Bypassing firewall...',
    'Escalating privileges...',
    'Establishing persistence...',
    'Exfiltrating data...',
    'Covering tracks...',
  ];

  let i = 0;
  const iv = setInterval(() => {
    if (i >= steps.length) {
      clearInterval(iv);
      print(`<span class="t-green">✓ HACK COMPLETE. Target compromised. Stay ghost.</span>`);
      print(`<span class="t-dim">(just a simulation — use your powers for good)</span>`);
      print('');
      scrollBottom();
      return;
    }
    const bar = '█'.repeat(Math.floor((i + 1) / steps.length * 20)).padEnd(20, '░');
    print(`<span class="t-dim">[<span class="t-green">${bar}</span>] ${steps[i]}</span>`);
    scrollBottom();
    i++;
  }, 300);
}

function cmdMatrix() {
  print(`<span class="t-green">
There is no spoon.

Wake up, Neo...
The Matrix has you...
Follow the white rabbit.

Knock, knock, Neo.
</span>`);
  print(`<span class="t-dim">// The answer was 42 all along.</span>`);
}

function cmdContact() {
  print(`
<span class="t-green">── CONTACT CHANNELS ────────────────────────────</span>
<span class="t-dim">GitHub    :</span> <span class="t-green">github.com/yourhandle</span>
<span class="t-dim">Twitter   :</span> <span class="t-green">@yourhandle</span>
<span class="t-dim">Email     :</span> <span class="t-green">your@email.com</span>
<span class="t-dim">CTFtime   :</span> <span class="t-green">your team profile</span>
<span class="t-dim">LinkedIn  :</span> <span class="t-green">linkedin.com/in/yourhandle</span>
<span class="t-dim">────────────────────────────────────────────────</span>
<span class="t-dim">PGP key available in CONTACT.cfg</span>
`);
}

function cmdHistory() {
  if (!cmdHistory.length) { print(`<span class="t-dim">No history.</span>`); return; }
  cmdHistory.slice().reverse().forEach((cmd, i) => {
    print(`<span class="t-dim">${String(i+1).padStart(4)}  </span><span class="t-green">${escHtml(cmd)}</span>`);
  });
}

function cmdIfconfig() {
  print(`
<span class="t-green">eth0:</span>      <span class="t-dim">flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt;</span>
           <span class="t-dim">inet 192.168.x.x  netmask 255.255.255.0</span>
<span class="t-green">tun0:</span>      <span class="t-dim">flags=4305&lt;UP,POINTOPOINT,RUNNING,NOARP,MULTICAST&gt;</span>
           <span class="t-dim">inet 10.x.x.x  P-t-P 10.x.x.x  netmask 255.255.255.255</span>
           <span class="t-dim">// VPN tunnel — ACTIVE</span>
<span class="t-green">tor0:</span>      <span class="t-dim">Anonymization layer — ONLINE</span>
<span class="t-green">lo:</span>        <span class="t-dim">inet 127.0.0.1  // localhost</span>
`);
}

function cmdUname(args) {
  if (args.includes('-a') || args.includes('-r')) {
    print(`<span class="t-green">HACK_OS 1.337-hackos #1 SMP PREEMPT Thu Jan 1 13:37:00 UTC 1970 x86_64 GNU/Linux</span>`);
  } else {
    print(`<span class="t-green">HACK_OS</span>`);
  }
}

function cmdDate() {
  print(`<span class="t-green">${new Date().toString()}</span>`);
}

function cmdEcho(args) {
  print(`<span class="t-white">${escHtml(args.join(' '))}</span>`);
}

function cmdMan(args) {
  if (!args[0]) { print(`<span class="t-err">What manual page do you want?</span>`); return; }
  print(`<span class="t-dim">No manual entry for '${escHtml(args[0])}'... yet. You ARE the manual.</span>`);
}

function cmdExit() {
  print(`<span class="t-green">Closing terminal session...</span>`);
  setTimeout(() => {
    if (typeof closeWindow === 'function') closeWindow('terminal');
  }, 600);
}
