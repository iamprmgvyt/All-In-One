const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("game")
        .setDescription("Play a mini-game!")
        .addStringOption(option =>
            option.setName("type")
                .setDescription("Choose a game")
                .setRequired(true)
                .addChoices(
                    { name: "Guess the Number", value: "guess" },
                    { name: "Rock Paper Scissors", value: "rps" },
                    { name: "Tic Tac Toe", value: "tictactoe" },
                    { name: "Hangman", value: "hangman" },
                    { name: "Math Quiz", value: "mathquiz" },
                    { name: "Typing Challenge", value: "typing" },
                    { name: "Higher or Lower", value: "higherlower" },
                    { name: "Blackjack", value: "blackjack" },
                    { name: "Minesweeper (small)", value: "minesweeper" },
                    { name: "Trivia", value: "trivia" }
                )
        ),

    async execute(interaction) {
        const game = interaction.options.getString("type");

        switch (game) {
            case "guess": {
                const number = Math.floor(Math.random() * 10) + 1;
                await interaction.reply(`🤔 I’m thinking of a number between **1-10**... Try to guess it!`);

                const filter = response => response.author.id === interaction.user.id;
                const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 10000, errors: ['time'] }).catch(() => null);

                if (collected) {
                    const userGuess = parseInt(collected.first().content);
                    if (userGuess === number) {
                        return interaction.followUp(`🎉 Correct! The number was **${number}**.`);
                    } else {
                        return interaction.followUp(`❌ Wrong! The number was **${number}**. Better luck next time!`);
                    }
                } else {
                    return interaction.followUp(`⏰ Time's up! The number was **${number}**.`);
                }
            }

            case "rps": {
                const choices = ["rock", "paper", "scissors"];
                await interaction.reply(`🤖 Choose your option: **rock**, **paper**, or **scissors**!`);

                const filter = response => {
                    return choices.includes(response.content.toLowerCase()) && response.author.id === interaction.user.id;
                };

                const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 10000, errors: ['time'] }).catch(() => null);

                if (collected) {
                    const playerChoice = collected.first().content.toLowerCase();
                    const botChoice = choices[Math.floor(Math.random() * choices.length)];
                    return interaction.followUp(`🤖 I choose **${botChoice}**! You chose **${playerChoice}**! ${determineRPSWinner(playerChoice, botChoice)}`);
                } else {
                    return interaction.followUp(`⏰ Time's up! You didn't make a choice.`);
                }
            }

            case "tictactoe": {
                // Placeholder for Tic Tac Toe logic
                return startTicTacToe(interaction);
            }

            case "hangman": {
                const words = ["discord", "javascript", "game", "bot", "hangman"];
                const word = words[Math.floor(Math.random() * words.length)];
                const hidden = word.replace(/./g, "_ ");
                await interaction.reply(`🎮 Hangman word: \`${hidden}\` (Guess a letter!)`);

                const filter = response => response.author.id === interaction.user.id && response.content.length === 1;
                const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 10000, errors: ['time'] }).catch(() => null);

                if (collected) {
                    const guess = collected.first().content.toLowerCase();
                    if (word.includes(guess)) {
                        return interaction.followUp(`✅ Good guess! The letter **${guess}** is in the word!`);
                    } else {
                        return interaction.followUp(`❌ Sorry, the letter **${guess}** is not in the word. The word was **${word}**.`);
                    }
                } else {
                    return interaction.followUp(`⏰ Time's up! The word was **${word}**.`);
                }
            }

            case "mathquiz": {
                const a = Math.floor(Math.random() * 10);
                const b = Math.floor(Math.random() * 10);
                await interaction.reply(`🧮 Solve: **${a} + ${b} = ?**`);

                const filter = response => response.author.id === interaction.user.id && !isNaN(response.content);
                const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 10000, errors: ['time'] }).catch(() => null);

                if (collected) {
                    const userAnswer = parseInt(collected.first().content);
                    const result = a + b;
                    if (userAnswer === result) {
                        return interaction.followUp(`🎉 Correct! The answer is **${result}**.`);
                    } else {
                        return interaction.followUp(`❌ Wrong! The correct answer is **${result}**.`);
                    }
                } else {
                    return interaction.followUp(`⏰ Time's up! The correct answer was **${a + b}**.`);
                }
            }

            case "typing": {
                const words = ["banana", "discord", "javascript", "gaming", "typing"];
                const word = words[Math.floor(Math.random() * words.length)];
                await interaction.reply(`⌨️ Type this fast: **${word}**`);

                const filter = response => response.author.id === interaction.user.id && response.content === word;
                const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 10000, errors: ['time'] }).catch(() => null);

                if (collected) {
                    return interaction.followUp(`🎉 You typed it correctly! **${word}**`);
                } else {
                    return interaction.followUp(`⏰ Time's up! You didn't type the word in time.`);
                }
            }

            case "higherlower": {
                const num1 = Math.floor(Math.random() * 100);
                const num2 = Math.floor(Math.random() * 100);
                await interaction.reply(`⬆️⬇️ Which is higher? **${num1}** or **${num2}**?`);

                const filter = response => response.author.id === interaction.user.id && (response.content === num1.toString() || response.content === num2.toString());
                const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 10000, errors: ['time'] }).catch(() => null);

                if (collected) {
                    const userChoice = parseInt(collected.first().content);
                    if (userChoice === (num1 > num2 ? num1 : num2)) {
                        return interaction.followUp(`🎉 Correct! The higher number was **${num1 > num2 ? num1 : num2}**.`);
                    } else {
                        return interaction.followUp(`❌ Wrong! The higher number was **${num1 > num2 ? num1 : num2}**.`);
                    }
                } else {
                    return interaction.followUp(`⏰ Time's up! The higher number was **${num1 > num2 ? num1 : num2}**.`);
                }
            }

            case "blackjack": {
                const card = () => Math.floor(Math.random() * 11) + 1;
                const player = card() + card();
                const dealer = card() + card();
                return interaction.reply(`🃏 You: **${player}** | Dealer: **${dealer}** → ${player > dealer ? "You win 🎉" : "Dealer wins 😢"}`);
            }

            case "minesweeper": {
                const grid = [
                    [":white_large_square:", ":bomb:", ":white_large_square:"],
                    [":white_large_square:", ":white_large_square:", ":white_large_square:"],
                    [":bomb:", ":white_large_square:", ":white_large_square:"]
                ];
                return interaction.reply(`💣 Minesweeper grid:\n${grid.map(r => r.join(" ")).join("\n")}`);
            }

            case "trivia": {
                const q = [
                    { q: "🌎 What is the capital of France?", a: "Paris" },
                    { q: "💻 Who created JavaScript?", a: "Brendan Eich" },
                    { q: "⚽ How many players in a football team?", a: "11" }
                ];
                const item = q[Math.floor(Math.random() * q.length)];
                await interaction.reply(`❓ Trivia: ${item.q}`);

                const filter = response => response.author.id === interaction.user.id;
                const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 10000, errors: ['time'] }).catch(() => null);

                if (collected) {
                    const userAnswer = collected.first().content;
                    if (userAnswer.toLowerCase() === item.a.toLowerCase()) {
                        return interaction.followUp(`🎉 Correct! The answer is **${item.a}**.`);
                    } else {
                        return interaction.followUp(`❌ Wrong! The correct answer is **${item.a}**.`);
                    }
                } else {
                    return interaction.followUp(`⏰ Time's up! The correct answer was **${item.a}**.`);
                }
            }

            default:
                return interaction.reply("❌ Unknown game.");
        }
    }
};

// Helper function to determine the winner in Rock Paper Scissors
function determineRPSWinner(player, bot) {
    if (player === bot) return "It's a tie!";
    if (
        (player === "rock" && bot === "scissors") ||
        (player === "paper" && bot === "rock") ||
        (player === "scissors" && bot === "paper")
    ) {
        return "You win! 🎉";
    }
    return "I win! 😢";
}

// Start Tic Tac Toe game
async function startTicTacToe(interaction) {
    // Placeholder for Tic Tac Toe logic
    return interaction.reply("❌⭕ Tic Tac Toe not interactive yet — but bot says you win 😆");
}
