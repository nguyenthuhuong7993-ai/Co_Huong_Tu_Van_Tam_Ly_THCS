document.addEventListener("DOMContentLoaded", function () {

    const chatMessages =
        document.getElementById("chatMessages");

    const messageInput =
        document.getElementById("messageInput");

    const sendBtn =
        document.getElementById("sendBtn");

    const quickReplies =
        document.getElementById("quickReplies");


    // =========================
    // THÊM TIN NHẮN
    // =========================

    function addMessage(text, sender) {

        const message = document.createElement("div");

        message.className =
            "message " +
            (sender === "user"
                ? "user-message"
                : "bot-message");


        if (sender === "bot") {

            message.innerHTML = `
                <div class="bot-avatar">
                    <i class="fas fa-user-nurse"></i>
                </div>

                <div class="message-content">
                    ${formatMessage(text)}
                </div>
            `;

        } else {

            message.innerHTML = `
                <div class="message-content">
                    ${formatMessage(text)}
                </div>
            `;

        }


        chatMessages.appendChild(message);

        scrollToBottom();
    }


    // =========================
    // ĐỊNH DẠNG TIN NHẮN
    // =========================

    function formatMessage(text) {

        return text
            .replace(/\n/g, "<br>")
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    }


    // =========================
    // CUỘN XUỐNG CUỐI
    // =========================

    function scrollToBottom() {

        chatMessages.scrollTo({

            top: chatMessages.scrollHeight,

            behavior: "smooth"

        });

    }


    // =========================
    // HIỆU ỨNG ĐANG TRẢ LỜI
    // =========================

    function showTyping() {

        const typing =
            document.createElement("div");

        typing.className =
            "message bot-message";

        typing.id = "typingMessage";


        typing.innerHTML = `
            <div class="bot-avatar">
                <i class="fas fa-user-nurse"></i>
            </div>

            <div class="message-content typing">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;


        chatMessages.appendChild(typing);

        scrollToBottom();

    }


    function removeTyping() {

        const typing =
            document.getElementById("typingMessage");

        if (typing) {

            typing.remove();

        }

    }


    // =========================
    // CHUYỂN TIẾNG VIỆT
    // =========================

    function removeVietnameseTones(str) {

        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D")
            .toLowerCase();

    }


    // =========================
    // TÌM CÂU TRẢ LỜI
    // =========================

    function findAnswer(message) {

        const text =
            removeVietnameseTones(message);


        let bestMatch = null;

        let bestScore = 0;


        knowledgeBase.forEach(item => {

            let score = 0;


            item.keywords.forEach(keyword => {

                const key =
                    removeVietnameseTones(keyword);


                if (text.includes(key)) {

                    score++;

                }

            });


            if (score > bestScore) {

                bestScore = score;

                bestMatch = item;

            }

        });


        if (bestMatch) {

            return bestMatch.response;

        }


        return `
            Cô Hường đang lắng nghe em. 💜

            Cô chưa hiểu thật rõ điều em muốn chia sẻ.
            Em có thể nói cụ thể hơn một chút được không?

            Ví dụ:
            • Em đang gặp khó khăn trong học tập
            • Em đang có mâu thuẫn với bạn
            • Em cảm thấy buồn hoặc lo lắng
            • Em đang gặp vấn đề trong gia đình
        `;

    }


    // =========================
    // GỬI TIN NHẮN
    // =========================

    function sendMessage() {

        const text =
            messageInput.value.trim();


        if (!text) {

            return;

        }


        // Hiển thị tin nhắn của học sinh

        addMessage(text, "user");


        // Xóa ô nhập

        messageInput.value = "";


        // Khóa nút trong lúc trả lời

        sendBtn.disabled = true;


        // Hiệu ứng đang trả lời

        showTyping();


        // Tạo độ trễ tự nhiên

        setTimeout(function () {

            removeTyping();


            const answer =
                findAnswer(text);


            addMessage(answer, "bot");


            sendBtn.disabled = false;

            messageInput.focus();

        }, 700);

    }


    // =========================
    // CLICK NÚT GỬI
    // =========================

    sendBtn.addEventListener(
        "click",
        sendMessage
    );


    // =========================
    // NHẤN ENTER
    // =========================

    messageInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendMessage();

            }

        }
    );


    // =========================
    // NÚT GỢI Ý
    // =========================

    document
        .querySelectorAll(".reply-btn")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const message =
                        button.dataset.message;


                    messageInput.value =
                        message;


                    sendMessage();

                }
            );

        });


    // =========================
    // FOCUS Ô NHẬP
    // =========================

    messageInput.focus();

});
