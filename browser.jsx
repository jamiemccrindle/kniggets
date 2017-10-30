import * as knights from './knights';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import glamorous from 'glamorous';

const colors = [
    'red', 'green', 'blue', 'darkgrey', 'indigo', 'orange', 'purple',
    'magenta', 'pink', 'silver', 'gold', 'aqua', 'teal', 'brown'
];

const cellWidth = 30;

const PageDiv = glamorous.div({
    fontFamily: 'Courier',
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '10vh'
})

const BoardTable = glamorous.table(
    { borderCollapse: 'collapse' }
)

const CellTd = glamorous.td(
    {
        cursor: 'pointer',
        padding: 5,
        width: cellWidth,
        height: cellWidth,
        verticalAlign: 'center',
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white',
    },
    ({ backgroundColor, even }) => ({
        backgroundColor: backgroundColor || (even ? 'rgb(253, 205, 163)' : 'rgb(200, 135, 71)')
    })
)

const InstructionsDiv = glamorous.div(
    {
        fontSize: '1.2em',
    }
)

const LabelTd = glamorous.td(
    {
        padding: 5,
        width: cellWidth,
        height: cellWidth,
        verticalAlign: 'center',
        textAlign: 'center',
    },
    ({ borderPosition }) => ({
        ['border' + borderPosition]: '2px solid grey'
    })
)

const HorizonalLabels = props => (
    <tr>
        <td></td>
        {knights.range(0, props.width).map(knights.numberToChar).map(value => (
            <LabelTd borderPosition={props.borderPosition} key={value}>{value}</LabelTd>
        ))}
        <td></td>
    </tr>
)

class App extends React.Component {
    constructor(props) {
        super(props);
        const { width, height, startX, startY, endX, endY } = this.props;
        const { board } = knights.shortest(width, height, startX, startY, endX, endY);
        //const board = knights.search(width, height, endX, endY);
        this.state = {
            width,
            height,
            startX,
            startY,
            endX,
            endY,
            board,
            start: true
        }
        this.recalculate = () => {
            const { board } = knights.shortest(
                this.state.width,
                this.state.height,
                this.state.startX,
                this.state.startY,
                this.state.endX,
                this.state.endY
            );
            this.setState({
                board,
            });
        }
        this.onClick = (x, y) => {
            if (this.state.start) {
                const { board } = knights.shortest(
                    this.state.width,
                    this.state.height,
                    x,
                    y,
                    this.state.endX,
                    this.state.endY,
                );
                this.setState({ startX: x, startY: y, board, start: false });
            } else {
                const { board } = knights.shortest(
                    this.state.width,
                    this.state.height,
                    this.state.startX,
                    this.state.startY,
                    x,
                    y,
                );
                this.setState({ endX: x, endY: y, board, start: true });
            }
        }
    }

    render() {
        const { board, width, start } = this.state;
        const rowsAndColumns = board.toRowsAndColumns();
        return (
            <PageDiv>
                <InstructionsDiv>{start ? 'Pick start' : 'Pick end'}</InstructionsDiv>
                <BoardTable>
                    <tbody>
                        <HorizonalLabels borderPosition='Bottom' width={width} />
                        {rowsAndColumns.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                <LabelTd borderPosition='Right'>{8 - rowIndex}</LabelTd>
                                {row.map((cell, cellIndex) => (
                                    <CellTd
                                        even={(rowIndex % 2 + cellIndex) % 2}
                                        backgroundColor={colors[cell]}
                                        key={cellIndex}
                                        onClick={() => this.onClick(rowIndex, cellIndex)}
                                    >
                                        {cell}
                                    </CellTd>
                                ))}
                                <LabelTd borderPosition='Left'>{8 - rowIndex}</LabelTd>
                            </tr>
                        ))}
                        <HorizonalLabels borderPosition='Top' width={width} />
                    </tbody>
                </BoardTable>
            </PageDiv>
        );
    }
}

ReactDOM.render(
    <App width={8} height={8} startX={0} startY={0} endX={4} endY={4} />,
    document.getElementById('root')
)