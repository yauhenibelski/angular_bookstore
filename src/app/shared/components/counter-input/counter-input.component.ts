/* eslint-disable no-use-before-define */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-counter-input',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule],
    templateUrl: './counter-input.component.html',
    styleUrl: './counter-input.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: CounterInputComponent,
            multi: true,
        },
    ],
})
export class CounterInputComponent implements ControlValueAccessor {
    isDisabled = false;
    counter = 0;

    constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

    writeValue(value: number): void {
        this.counter = value;

        this.changeDetectorRef.markForCheck();
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;

        this.changeDetectorRef.markForCheck();
    }

    increase(): void {
        this.counter += 1;

        this.onChange(this.counter);
        this.onTouched();
    }

    decrease(): void {
        if (this.counter > 1) {
            this.counter -= 1;

            this.onChange(this.counter);
            this.onTouched();
        }
    }

    registerOnChange(onChange: (value: number) => void): void {
        this.onChange = onChange;
    }

    registerOnTouched(onTouched: () => void): void {
        this.onTouched = onTouched;
    }

    private onTouched: () => void = () => {
        // onTouched
    };

    private onChange: (value: number) => void = () => {
        // onChange
    };
}
