import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  numberForm: FormGroup;
  additionalInputs: any[] = [];
  dynamicInputValues: any[] = [];
  calculateValues: any[] = [];
  displayStyle1 = 'none';
  displayStyle2 = 'none';
  subText = '';
  mainText = '';
  operand1: number;
  operand2: number;
  operator = '';
  calculationString = '';
  answered = false;
  operatorSet = false;

  ngOnInit() {
    this.numberForm = new FormGroup({
      number1: new FormControl(null, Validators.required),
      number2: new FormControl(null, Validators.required),
    });
  }

  addInput() {
    const newInput = new FormControl(null, Validators.required);
    this.additionalInputs.push(newInput);
    const dynamicInputName = `number${this.additionalInputs.length + 2}`;
    this.numberForm.addControl(dynamicInputName, newInput);
  }

  onEvaluate() {
    this.displayStyle1 = 'block';
    this.dynamicInputValues = Object.values(this.numberForm.value);
  }
  onSubmit() {
    // console.log('Form Values:', this.numberForm.value);
  }

  onClose() {
    this.displayStyle1 = 'none';
    this.calculateValues = [];
    this.dynamicInputValues = [];
    this.mainText = '';
    this.subText = '';
    this.operatorSet = false;
  }

  drop(event: CdkDragDrop<any[]>) {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    this.mainText += this.calculateValues[0];
  }

  oper(key: string) {
    if (key === '/' || key === 'x' || key === '-' || key === '+') {
      const lastKey = this.mainText[this.mainText.length - 1];
      if (
        lastKey === '/' ||
        lastKey === 'x' ||
        lastKey === '-' ||
        lastKey === '+'
      ) {
        this.operatorSet = true;
      }
      if (this.operatorSet || this.mainText === '') {
        return;
      }
      this.operand1 = parseFloat(this.mainText);
      this.operator = key;
      this.operatorSet = true;
    }
    this.mainText += key;
  }
  onClear() {
    this.mainText = '';
    this.subText = '';
    this.operatorSet = false;
  }

  onEvaluation() {
    this.calculationString = this.mainText;
    this.operand2 = parseFloat(this.mainText.split(this.operator)[1]);
    if (this.operator === '/') {
      if (this.operand2 === 0) {
        this.subText = 'Error';
        return;
      }
      this.subText = this.mainText;
      this.mainText = (this.operand1 / this.operand2).toString();
      this.subText = this.calculationString;
    } else if (this.operator === 'x') {
      this.subText = this.mainText;
      this.mainText = (this.operand1 * this.operand2).toString();
      this.subText = this.calculationString;
    } else if (this.operator === '-') {
      this.subText = this.mainText;
      this.mainText = (this.operand1 - this.operand2).toString();
      this.subText = this.calculationString;
    } else if (this.operator === '+') {
      this.subText = this.mainText;
      this.mainText = (this.operand1 + this.operand2).toString();
      this.subText = this.calculationString;
    } else {
      this.subText = 'ERROR: Invalid Operation';
    }
    this.answered = true;
    this.displayStyle2 = 'block';
  }

  onAnswerClose() {
    this.displayStyle2 = 'none';
    if (this.dynamicInputValues.length >= 1) {
      this.subText = '';
      this.operatorSet = false;
    }
  }
}
