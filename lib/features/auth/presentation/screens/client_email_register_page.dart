import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:fitkle/core/theme/app_colors.dart';

class ClientEmailRegisterPage extends StatefulWidget {
  const ClientEmailRegisterPage({super.key});

  @override
  State<ClientEmailRegisterPage> createState() => _ClientEmailRegisterPageState();
}

class _ClientEmailRegisterPageState extends State<ClientEmailRegisterPage> {
  bool agreeAll = false;
  bool agree14 = false;
  bool agreeService = false;
  bool agreePrivacy = false;
  bool agreeMarketing = false;
  bool showPassword = false;

  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController password2Controller = TextEditingController();

  String? emailError;
  late String? type;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final state = GoRouterState.of(context);
    type = state.uri.queryParameters['type'];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        padding: const EdgeInsets.only(top: 48, bottom: 32),
        child: Center(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 16),
              MouseRegion(
                cursor: SystemMouseCursors.click,
                child: GestureDetector(
                  onTap: () => GoRouter.of(context).go('/'),
                  child: SvgPicture.asset('assets/logo/FITKLE.svg', height: 48),
                ),
              ),
              const SizedBox(height: 48),
              const Text(
                '회원가입하고',
                style: TextStyle(fontSize: 32, fontWeight: FontWeight.w700, color: Colors.black, height: 1.2),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              const Text(
                '비즈니스 성공을 시작해 보세요!',
                style: TextStyle(fontSize: 28, fontWeight: FontWeight.w700, color: Colors.black, height: 1.2),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('이미 계정이 있으신가요?', style: TextStyle(color: Color(0xFF6B7280), fontSize: 15)),
                  const SizedBox(width: 4),
                  GestureDetector(
                    onTap: () => GoRouter.of(context).go('/login'),
                    child: const Text('로그인하기', style: TextStyle(color: Color(0xFF2563EB), fontSize: 15, decoration: TextDecoration.underline)),
                  ),
                ],
              ),
              const SizedBox(height: 40),
              Center(
                child: _InputSection(
                  emailController: emailController,
                  passwordController: passwordController,
                  password2Controller: password2Controller,
                  showPassword: showPassword,
                  onTogglePassword: () => setState(() => showPassword = !showPassword),
                ),
              ),
              const SizedBox(height: 32),
              _AgreementSection(
                agreeAll: agreeAll,
                agree14: agree14,
                agreeService: agreeService,
                agreePrivacy: agreePrivacy,
                agreeMarketing: agreeMarketing,
                onChangedAll: (v) => setState(() {
                  agreeAll = v;
                  agree14 = v;
                  agreeService = v;
                  agreePrivacy = v;
                  agreeMarketing = v;
                }),
                onChanged14: (v) => setState(() => agree14 = v),
                onChangedService: (v) => setState(() => agreeService = v),
                onChangedPrivacy: (v) => setState(() => agreePrivacy = v),
                onChangedMarketing: (v) => setState(() => agreeMarketing = v),
              ),
              const SizedBox(height: 32),
              SizedBox(
                width: 480,
                height: 56,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.grayLight,
                    foregroundColor: Colors.black,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
                    elevation: 0,
                  ),
                  onPressed: () {
                    if (type == 'tutor') {
                      GoRouter.of(context).go('/expert-register-complete');
                    } else {
                      GoRouter.of(context).go('/identity-verification');
                    }
                  },
                  child: const Text('가입완료'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _InputSection extends StatefulWidget {
  final TextEditingController emailController;
  final TextEditingController passwordController;
  final TextEditingController password2Controller;
  final bool showPassword;
  final VoidCallback onTogglePassword;

  const _InputSection({
    required this.emailController,
    required this.passwordController,
    required this.password2Controller,
    required this.showPassword,
    required this.onTogglePassword,
  });

  @override
  State<_InputSection> createState() => _InputSectionState();
}

class _InputSectionState extends State<_InputSection> {
  String? emailError;

  bool get isPasswordValid {
    final password = widget.passwordController.text;
    final hasMinLength = password.length >= 8;
    final hasLetter = RegExp(r'[A-Za-z]').hasMatch(password);
    final hasNumber = RegExp(r'[0-9]').hasMatch(password);
    final hasSpecial = RegExp(r'[!@#\$&*~]').hasMatch(password);
    return hasMinLength && hasLetter && hasNumber && hasSpecial;
  }

  bool get isPasswordMatch =>
    widget.passwordController.text == widget.password2Controller.text;

  bool get showPasswordError =>
    widget.password2Controller.text.isNotEmpty && !isPasswordMatch;

  String? get passwordMatchError {
    if (!showPasswordError) return null;
    return '비밀번호가 일치하지 않아요 확인해 주세요';
  }

  @override
  void initState() {
    super.initState();
    widget.emailController.addListener(_validateEmail);
    widget.passwordController.addListener(() => setState(() {}));
    widget.password2Controller.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    widget.emailController.removeListener(_validateEmail);
    widget.passwordController.removeListener(() => setState(() {}));
    widget.password2Controller.removeListener(() => setState(() {}));
    super.dispose();
  }

  void _validateEmail() {
    final value = widget.emailController.text;
    if (value.isEmpty) {
      setState(() => emailError = null);
      return;
    }
    final emailRegex = RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+ ?$');
    if (!emailRegex.hasMatch(value)) {
      setState(() => emailError = '이메일 주소가 올바르지 않아요');
    } else {
      setState(() => emailError = null);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        SizedBox(
          width: 480,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('이메일', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
              const SizedBox(height: 8),
              TextFormField(
                controller: widget.emailController,
                style: const TextStyle(
                  color: Colors.black,
                  fontWeight: FontWeight.w500,
                  fontSize: 14,
                ),
                cursorColor: Colors.black,
                maxLines: 1,
                minLines: 1,
                textAlignVertical: TextAlignVertical.center,
                autovalidateMode: AutovalidateMode.onUserInteraction,
                decoration: InputDecoration(
                  hintText: '이메일을 입력해 주세요',
                  border: OutlineInputBorder(
                    borderSide: BorderSide(color: emailError != null ? Colors.red : AppColors.grayLight),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: emailError != null ? Colors.red : AppColors.grayLight),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: emailError != null ? Colors.red : AppColors.grayLight, width: 2),
                  ),
                  errorBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.red, width: 2),
                  ),
                  focusedErrorBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.red, width: 2),
                  ),
                  hintStyle: TextStyle(fontSize: 16, color: AppColors.grayLight),
                  isDense: true,
                  contentPadding: EdgeInsets.symmetric(vertical: 17, horizontal: 20),
                  errorText: null,
                ),
              ),
              if (emailError != null)
                Padding(
                  padding: const EdgeInsets.only(top: 6, left: 4),
                  child: Text(
                    emailError!,
                    style: const TextStyle(color: Colors.red, fontSize: 13),
                  ),
                ),
            ],
          ),
        ),
        const SizedBox(height: 20),
        SizedBox(
          width: 480,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('비밀번호', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
                  IconButton(
                    icon: Icon(widget.showPassword ? Icons.visibility_off : Icons.visibility, color: Color(0xFF9CA3AF)),
                    onPressed: widget.onTogglePassword,
                    splashColor: Colors.transparent,
                    highlightColor: Colors.transparent,
                    hoverColor: Colors.transparent,
                    padding: EdgeInsets.zero,
                    constraints: BoxConstraints(),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              TextField(
                controller: widget.passwordController,
                style: const TextStyle(
                  color: Colors.black,
                  fontWeight: FontWeight.w500,
                  fontSize: 14,
                ),
                cursorColor: Colors.black,
                maxLines: 1,
                minLines: 1,
                textAlignVertical: TextAlignVertical.center,
                obscureText: !widget.showPassword,
                decoration: InputDecoration(
                  hintText: '영문, 숫자, 특수문자가 모두 들어간 8자 이상',
                  border: OutlineInputBorder(
                    borderSide: BorderSide(color: showPasswordError ? Colors.red : AppColors.grayLight),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: showPasswordError ? Colors.red : AppColors.grayLight),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: showPasswordError ? Colors.red : AppColors.grayLight, width: 2),
                  ),
                  errorBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.red, width: 2),
                  ),
                  focusedErrorBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.red, width: 2),
                  ),
                  hintStyle: TextStyle(fontSize: 16, color: AppColors.grayLight),
                  isDense: true,
                  contentPadding: EdgeInsets.symmetric(vertical: 17, horizontal: 20),
                  suffixIcon: isPasswordValid
                    ? Icon(Icons.check_circle, color: Colors.green)
                    : null,
                ),
                onChanged: (_) => setState(() {}),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          width: 480,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 0),
              TextField(
                controller: widget.password2Controller,
                style: const TextStyle(
                  color: Colors.black,
                  fontWeight: FontWeight.w500,
                  fontSize: 14,
                ),
                cursorColor: Colors.black,
                maxLines: 1,
                minLines: 1,
                textAlignVertical: TextAlignVertical.center,
                obscureText: !widget.showPassword,
                decoration: InputDecoration(
                  hintText: '비밀번호를 한번 더 입력해 주세요',
                  border: OutlineInputBorder(
                    borderSide: BorderSide(color: showPasswordError ? Colors.red : AppColors.grayLight),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: showPasswordError ? Colors.red : AppColors.grayLight),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: showPasswordError ? Colors.red : AppColors.grayLight, width: 2),
                  ),
                  errorBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.red, width: 2),
                  ),
                  focusedErrorBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.red, width: 2),
                  ),
                  hintStyle: TextStyle(fontSize: 16, color: AppColors.grayLight),
                  isDense: true,
                  contentPadding: EdgeInsets.symmetric(vertical: 17, horizontal: 20),
                  suffixIcon: null,
                ),
                onChanged: (_) => setState(() {}),
              ),
              if (passwordMatchError != null)
                Padding(
                  padding: const EdgeInsets.only(top: 6, left: 4),
                  child: Text(
                    passwordMatchError!,
                    style: const TextStyle(color: Colors.red, fontSize: 13),
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }
}

// 링크에 일직선 밑줄을 주는 위젯
Widget underlineLink(String text, {VoidCallback? onTap}) {
  return GestureDetector(
    onTap: onTap,
    child: Container(
      decoration: const BoxDecoration(
        border: Border(
          bottom: BorderSide(
            color: Color(0xFF2563EB),
            width: 1.5,
          ),
        ),
      ),
      child: Text(
        text,
        style: const TextStyle(
          color: Color(0xFF2563EB),
          fontSize: 15
        ),
      ),
    ),
  );
}

class _AgreementSection extends StatelessWidget {
  final bool agreeAll;
  final bool agree14;
  final bool agreeService;
  final bool agreePrivacy;
  final bool agreeMarketing;
  final ValueChanged<bool> onChangedAll;
  final ValueChanged<bool> onChanged14;
  final ValueChanged<bool> onChangedService;
  final ValueChanged<bool> onChangedPrivacy;
  final ValueChanged<bool> onChangedMarketing;

  const _AgreementSection({
    required this.agreeAll,
    required this.agree14,
    required this.agreeService,
    required this.agreePrivacy,
    required this.agreeMarketing,
    required this.onChangedAll,
    required this.onChanged14,
    required this.onChangedService,
    required this.onChangedPrivacy,
    required this.onChangedMarketing,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 480,
      padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 24),
      decoration: BoxDecoration(
        color: const Color(0xFFF9FAFB),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFF3F4F6), width: 2),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _AgreementItem(
            value: agreeAll,
            onChanged: onChangedAll,
            child: const Text('모두 동의합니다.', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16)),
          ),
          const Divider(height: 32, thickness: 1, color: Color(0xFFE5E7EB)),
          _AgreementItem(
            value: agree14,
            onChanged: onChanged14,
            child: const Text('만 14세 이상입니다.', style: TextStyle(color: Color(0xFF374151), fontSize: 15, height: 1.0)),
          ),
          SizedBox(height: 10),
          _AgreementItem(
            value: agreeService,
            onChanged: onChangedService,
            child: Row(
              children: [
                _UnderlineLinkText('서비스 이용약관'),
                const Text('에 동의합니다.', style: TextStyle(color: Color(0xFF374151), fontSize: 15, height: 1.0)),
              ],
            ),
          ),
          SizedBox(height: 10),
          _AgreementItem(
            value: agreePrivacy,
            onChanged: onChangedPrivacy,
            child: Row(
              children: [
                _UnderlineLinkText('개인정보 수집 이용'),
                const Text('에 동의합니다.', style: TextStyle(color: Color(0xFF374151), fontSize: 15, height: 1.0)),
              ],
            ),
          ),
          SizedBox(height: 10),
          _AgreementItem(
            value: agreeMarketing,
            onChanged: onChangedMarketing,
            optional: true,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Text('마케팅 수신 홍보목적의 ', style: TextStyle(color: Color(0xFF374151), fontSize: 15, height: 1.0)),
                    _UnderlineLinkText('개인정보 수집 및 이용'),
                  ],
                ),
                const SizedBox(height: 4),
                const Text('에 동의합니다.(선택)', style: TextStyle(color: Color(0xFF374151), fontSize: 15, height: 1.0)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _AgreementItem extends StatelessWidget {
  final bool value;
  final ValueChanged<bool> onChanged;
  final Widget child;
  final bool optional;

  const _AgreementItem({
    required this.value,
    required this.onChanged,
    required this.child,
    this.optional = false,
  });

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Checkbox(
            value: value,
            onChanged: (v) => onChanged(v ?? false),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
            side: const BorderSide(color: Color(0xFFD1D5DB), width: 2),
            activeColor: Colors.black,
            checkColor: Colors.white,
            materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
            hoverColor: Colors.transparent,
            overlayColor: WidgetStateProperty.all(Colors.transparent),
            visualDensity: VisualDensity(horizontal: -4, vertical: -4),
          ),
          const SizedBox(width: 8),
          Flexible(child: child),
        ],
      ),
    );
  }
}

// 일직선 밑줄 텍스트 위젯
class _UnderlineLinkText extends StatelessWidget {
  final String text;
  const _UnderlineLinkText(this.text);
  @override
  Widget build(BuildContext context) {
    return Container(
      alignment: Alignment.bottomLeft,
      decoration: const BoxDecoration(
        border: Border(
          bottom: BorderSide(
            color: Color(0xFF2563EB),
            width: 1.5,
          ),
        ),
      ),
      child: Text(
        text,
        style: const TextStyle(
          color: Color(0xFF2563EB),
          fontSize: 15,
          height: 1.0,
        ),
      ),
    );
  }
} 