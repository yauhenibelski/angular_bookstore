/* eslint-disable no-use-before-define */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
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
    readonly isDisabled = signal(false);
    readonly counter = signal(0);

    writeValue(value: number): void {
        this.counter.set(value);
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled.set(isDisabled);
    }

    increase(): void {
        this.counter.update(oldValue => oldValue + 1);

        this.onChange(this.counter());
        this.onTouched();
    }

    decrease(): void {
        if (this.counter() > 1) {
            this.counter.update(oldValue => oldValue - 1);

            this.onChange(this.counter());
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
        // ---
    };

    private onChange: (value: number) => void = () => {
        // ---
    };
}
