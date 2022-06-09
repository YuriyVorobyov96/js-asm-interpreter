class AssemblerInterpreter {
  instructionsMap = {
    mov: this.#mov,
    inc: this.#inc,
    dec: this.#dec,
    jnz: this.#jnz,
  };

  constructor() {}

  run(program) {
    this.registersDataStorage = {};
    this.program = program;

    return this.#commandExecutor();
  }

  #commandExecutor() {  
    for (this.iter = 0; this.iter < this.program.length; this.iter++) {
      const [ command, ...args ] = this.program[this.iter].split(' ');

      this.#executeCommand(command, args);
    }

    return this.registersDataStorage;
  }

  #executeCommand(command, args) {
    return this.instructionsMap[command].call(this, ...args);
  }

  #jumpToCommand(shift) {
    this.iter += (shift - 1);
  }

  #isRegister(arg) {
    return this.registersDataStorage.hasOwnProperty(arg);
  }

  #mov(reg, arg) {
    this.registersDataStorage[reg] = this.#isRegister(arg) ?
      this.registersDataStorage[arg] :
      Number(arg);
  }

  #inc(reg) {
    this.registersDataStorage[reg] += 1;
  }

  #dec(reg) {
    this.registersDataStorage[reg] -= 1;
  }

  #jnz(arg1, arg2) {
    const condVal = this.#isRegister(arg1) ?
      this.registersDataStorage[arg1] :
      Number(arg1);
    const shift = condVal !== 0 ? Number(arg2) : 1;

    return this.#jumpToCommand(shift);
  }
}

function simple_assembler(program) {
  const asm = new AssemblerInterpreter();

  return asm.run(program);
}

const res = simple_assembler([
  'mov a 1',
  'mov b 1',
  'mov c 0',
  'mov d 26',
  'jnz c 2',
  'jnz 1 5',
  'mov c 7',
  'inc d',
  'dec c',
  'jnz c -2',
  'mov c a',
  'inc a',
  'dec b',
  'jnz b -2',
  'mov b c',
  'dec d',
  'jnz d -6',
  'mov c 18',
  'mov d 11',
  'inc a',
  'dec d',
  'jnz d -2',
  'dec c',
  'jnz c -5',
]);

console.log(res);
