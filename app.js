document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const msg = document.querySelector('.message');
    let width = 10;
    let bombsAmt = 20;
    let squares = [];
    let flags = 0;
    let isgameOver = false;

    // Create Board
    function createBoard() {

        // shuffle array with random Bombs
        const bombsArray = Array(bombsAmt).fill('bomb');
        const emptyArray = Array(width * width - bombsAmt).fill('valid');
        const gameArray = emptyArray.concat(bombsArray);
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5);


        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.setAttribute('id', i);
            square.classList.add(shuffledArray[i])
            grid.appendChild(square);
            squares.push(square);

            square.addEventListener('click', function (e) {
                click(square)
            })

            // cntrl and left click
            square.oncontextmenu = function (e) {
                e.preventDefault();
                addFlag(square);
            }
        }

        // add numbers
        for (let i = 0; i < squares.length; i++) {
            const isLeftEdge = (i % width == 0);
            const isRightEdge = (i % width - 1 == 0);
            let total = 0;
            if (squares[i].classList.contains('valid')) {
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++
                if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++
                if (i > 10 && squares[i - width].classList.contains('bomb')) total++
                if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++
                if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++
                if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++
                if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++
                if (i < 89 && squares[i + width].classList.contains('bomb')) total++

                squares[i].setAttribute('data', total);
            }
        }
    }

    createBoard();

    // add flag with right click
    function addFlag(square) {
        if (isgameOver) return;
        if (!square.classList.contains('checked') && (flags < bombsAmt)) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag')
                square.innerHTML = '🚩'
                checkForWin();
                flags++
            } else {
                square.classList.remove('flag');
                square.innerHTML = '';
                flags--;
            }
        }
    }

    function click(square) {
        let currentId = square.id;

        if (isgameOver) return;
        if (square.classList.contains('checked') || square.classList.contains('flag')) return;


        if (square.classList.contains('bomb')) {
            gameOver(square);
        } else {
            let total = square.getAttribute('data');
            if (total != 0) {
                square.classList.add('checked');
                square.innerHTML = total;
                return;
            }

            checkSquare(square, currentId);
        }

        square.classList.add('checked');

    }

    // Check Neighbouring squares
    function checkSquare(square, currentId) {
        const isLeftEdge = (currentId % width === 0);
        const isRightEdge = (currentId % width === width - 1);
        const newId = 0;

        setTimeout(() => {
            if (currentId > 0 && !isLeftEdge) newId = squares[parseInt(currentId) - 1].id;

            if (currentId > 9 && !isRightEdge) newId = squares[parseInt(currentId) + 1 - width].id;

            if (currentId > 10) newId = squares[parseInt(currentId) - width].id;

            if (currentId > 11 && !isLeftEdge) newId = squares[parseInt(currentId) - 1 - width].id;

            if (currentId < 98 && !isRightEdge) newId = squares[parseInt(currentId) + 1].id;

            if (currentId < 90 && !isLeftEdge) newId = squares[parseInt(currentId) - 1 + width].id;

            if (currentId < 88 && !isRightEdge) newId = squares[parseInt(currentId) + 1 + width].id;

            if (currentId < 88) newId = squares[parseInt(currentId) + width].id;

            const newSquare = document.getElementById(newId);
            click(newSquare);
        }, 10);
    }

    function gameOver(square) {
        msg.innerHTML = 'Game Over';
        isgameOver = true;
        // show All bombs
        squares.forEach(square => {
            if (square.classList.contains('bomb'))
                square.innerHTML = '💣';
        })

    }

    function checkForWin() {
        let matches = 0;
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches++;
            }
            if (matches === bombsAmt) {
                msg.innerHTML = 'You Win';
                isgameOver = true;

            }

        }
    }
});