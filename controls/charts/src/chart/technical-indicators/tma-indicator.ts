/* eslint-disable jsdoc/require-returns */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-param */
import { Series, Points } from '../series/chart-series';
import { firstToLowerCase } from '../../common/utils/helper';
import { TechnicalIndicator } from './technical-indicator';
import { TechnicalAnalysis } from './indicator-base';
import { Chart } from '../chart';

/**
 * `TmaIndicator` module is used to render TMA indicator.
 */
export class TmaIndicator extends TechnicalAnalysis {

    /**
     * Defines the predictions based on TMA approach
     *
     * @private
     */
    public initDataSource(indicator: TechnicalIndicator, chart: Chart): void {
        const tmaPoints: Points[] = [];
        const field: string = firstToLowerCase(indicator.field);
        const xField: string = 'x';

        //prepare data
        const validData: Points[] = indicator.points;

        if (validData && validData.length && validData.length >= indicator.period) {

            const signalSeries: Series = indicator.targetSeries[0];
            //prepare data
            const validData: Points[] = indicator.points;

            if (validData.length && validData.length >= indicator.period) {
                let sum: number = 0;
                const smaValues: number[] = [];
                //sma values
                let index: number = 0;
                let length: number = validData.length;
                const period: number = indicator.period;
                while (length >= period) {
                    sum = 0;
                    index = validData.length - length;
                    for (let j: number = index; j < index + period; j++) {
                        sum = sum + validData[j as number][field as string];
                    }
                    sum = sum / period;
                    smaValues.push(sum);
                    length--;
                }

                //initial values
                for (let k: number = 0; k < period - 1; k++) {
                    sum = 0;
                    for (let j: number = 0; j < k + 1; j++) {
                        sum = sum + validData[j as number][field as string];
                    }
                    sum = sum / (k + 1);
                    smaValues.splice(k, 0, sum);
                }

                index = indicator.period;
                while (index <= smaValues.length) {
                    sum = 0;
                    for (let j: number = index - indicator.period; j < index; j++) {
                        sum = sum + smaValues[j as number];
                    }
                    sum = sum / indicator.period;
                    tmaPoints.push(this.getDataPoint(
                        validData[index - 1][xField as string], sum, validData[index - 1], signalSeries, tmaPoints.length));
                    index++;
                }
            }
        }
        this.setSeriesRange(tmaPoints, indicator);
    }

    /**
     * To destroy the TMA indicator.
     *
     * @returns {void}
     * @private
     */

    public destroy(): void {
        /**
         * Destroys the TMA Indicator
         */
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name of the series
         */
        return 'TmaIndicator';
    }
}
